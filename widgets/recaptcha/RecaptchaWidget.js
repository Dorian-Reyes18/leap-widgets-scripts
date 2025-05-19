const recaptchaWidgetDefinition = {
  id: "custom.Recaptcha",
  version: "2.0.0",
  apiVersion: "1.0.0",
  label: "Google reCAPTCHA",
  description: "Verificación anti-bots con Google reCAPTCHA",
  datatype: { type: "string" }, // Este sí va con `datatype` porque describe la salida del widget
  category: { id: "custom.security", label: "Avanzado" },
  iconClassName: "fa fa-shield-alt",
  builtInProperties: [{ id: "required" }, { id: "title" }],
  properties: [
    {
      id: "siteKey",
      label: "Clave del sitio (SiteKey)",
      propType: "string",
      defaultValue: "6Ld6zxArAAAAAPDYDDPDAOfjpZguznwnM8m5W7vd",
    },
  ],
  instantiate: function (context, domNode, initialProps, eventManager) {
    const widgetId = "recaptcha_" + context.dataId;
    const container = document.createElement("div");
    container.id = widgetId;
    domNode.appendChild(container);

    let token = "";

    function renderRecaptcha() {
      if (window.grecaptcha && container) {
        window.grecaptcha.render(widgetId, {
          sitekey: initialProps.siteKey,
          callback: function (responseToken) {
            token = responseToken;
          },
        });
      }
    }

    if (window.grecaptcha) {
      renderRecaptcha();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderRecaptcha;
      document.head.appendChild(script);
    }

    return {
      getValue: function () {
        return token;
      },
      setValue: function (val) {
        token = val;
      },
      validateValue: function (val) {
        if ((val === "" || val == null) && initialProps.required) {
          return "Por favor, verifica el reCAPTCHA";
        }
        return true;
      },
      setProperty: function (propName, propValue) {
        if (propName === "siteKey") {
          initialProps.siteKey = propValue;
          if (window.grecaptcha) {
            window.grecaptcha.reset();
            renderRecaptcha();
          }
        }
      },
    };
  },
};

nitro.registerWidget(recaptchaWidgetDefinition);
