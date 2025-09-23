import { API_BASE_URL } from '../config';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const postToBackend = async (path, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload),
    });

    const data = await safeJson(response);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message ?? 'Backend request failed',
        data,
        status: response.status,
      };
    }

    return {
      success: true,
      message: data?.message ?? 'Request completed',
      data,
      status: response.status,
    };
  } catch (error) {
    console.warn('Backend unreachable, falling back to Formspree if configured', error);
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

const withFallback = async (primary, fallback) => {
  const primaryResult = await primary();
  if (primaryResult.success) {
    return primaryResult;
  }

  if (!fallback) {
    return primaryResult;
  }

  const secondaryResult = await fallback(primaryResult);
  return secondaryResult;
};

export const sendFormspreeSubmission = async (data, formId) => {
  if (!formId) {
    return {
      success: false,
      message: 'Formspree form ID not configured',
    };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const payload = await safeJson(response);

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message ?? 'Formspree submission failed',
        data: payload,
        status: response.status,
      };
    }

    return {
      success: true,
      message: payload?.message ?? 'Submission received',
      data: payload,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error,
    };
  }
};

export const sendKeymasterEnrollment = async (enrollmentData) => {
  return withFallback(
    () => postToBackend('/api/typing/enrollments', enrollmentData),
    (primaryResult) => {
      const fallbackFormId = import.meta.env.VITE_FORMSPREE_ENROLLMENT_ID ?? 'xjkyqwjd';
      return sendFormspreeSubmission(enrollmentData, fallbackFormId).then((result) => ({
        ...result,
        message: result.success
          ? 'Enrollment received via Formspree fallback'
          : result.message ?? primaryResult.message,
      }));
    },
  );
};

export const sendEducationInquiry = async (inquiryData) => {
  return withFallback(
    () => postToBackend('/api/typing/inquiries', inquiryData),
    (primaryResult) => {
      const fallbackFormId = import.meta.env.VITE_FORMSPREE_CONTACT_ID ?? null;
      if (!fallbackFormId) {
        return Promise.resolve(primaryResult);
      }
      return sendFormspreeSubmission(inquiryData, fallbackFormId);
    },
  );
};

export const sendContactMessage = async (contactData) => {
  const name = contactData.name ?? contactData.parent_name ?? 'Parent';
  const email = contactData.email ?? contactData.parent_email ?? '';
  const phone = contactData.parent_phone ?? contactData.phone ?? '';

  const detailLines = [contactData.message ?? ''];
  if (phone) {
    detailLines.push(`Phone: ${phone}`);
  }
  if (contactData.topic) {
    detailLines.push(`Topic: ${contactData.topic}`);
  }
  if (contactData.origin) {
    detailLines.push(`Origin: ${contactData.origin}`);
  }

  const payload = {
    name,
    email,
    message: detailLines.filter(Boolean).join('\n').trim(),
  };

  const fallbackFormId = import.meta.env.VITE_FORMSPREE_CONTACT_ID ?? null;

  return withFallback(
    () => postToBackend('/api/contact', payload),
    (primaryResult) => {
      if (!fallbackFormId) {
        return Promise.resolve(primaryResult);
      }
      return sendFormspreeSubmission(
        {
          name,
          email,
          phone: phone || undefined,
          message: payload.message,
          topic: contactData.topic ?? undefined,
          origin: contactData.origin ?? undefined,
        },
        fallbackFormId,
      ).then((result) => ({
        ...result,
        message: result.success
          ? 'Contact message sent via Formspree fallback'
          : result.message ?? primaryResult.message,
      }));
    },
  );
};
