(function () {
    function setMessage(box, baseClass, isSuccess, text) {
        if (!box) {
            return;
        }

        box.className = baseClass + " " + (isSuccess ? "text-success" : "text-danger");
        box.textContent = text;
    }

    function encodeContactBody(data) {
        return [
            "Name: " + data.name,
            "Email: " + data.email,
            "Phone: " + data.phone,
            "Subject: " + data.subject,
            "",
            "Message:",
            data.message
        ].join("\n");
    }

    function openMailClient(subject, body) {
        window.location.href = "mailto:corporate@viskez.com"
            + "?subject=" + encodeURIComponent(subject)
            + "&body=" + encodeURIComponent(body);
    }

    function postForm(form) {
        return fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                "Accept": "application/json"
            }
        }).then(function (response) {
            return response.json().then(function (payload) {
                if (!response.ok || !payload.success) {
                    throw new Error(payload.message || "Unable to submit.");
                }

                return payload;
            });
        });
    }

    var contactForm = document.getElementById("contactForm");
    var contactMessage = document.getElementById("msgSubmit");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                setMessage(contactMessage, "contact-submit-message", false, "Please complete all required fields.");
                return;
            }

            var formData = new FormData(contactForm);
            var contactData = {
                name: (formData.get("name") || "").trim(),
                email: (formData.get("email") || "").trim(),
                phone: (formData.get("phone") || "").trim(),
                subject: (formData.get("subject") || "Website enquiry").trim(),
                message: (formData.get("message") || "").trim()
            };

            setMessage(contactMessage, "contact-submit-message", true, "Sending message...");

            postForm(contactForm)
                .then(function () {
                    contactForm.reset();
                    setMessage(contactMessage, "contact-submit-message", true, "Message sent successfully.");
                })
                .catch(function () {
                    openMailClient(contactData.subject || "Website enquiry", encodeContactBody(contactData));
                    setMessage(contactMessage, "contact-submit-message", true, "Opening your email app to send the message.");
                });
        });
    }

    var subscribeForm = document.getElementById("subscribeForm");
    var subscribeMessage = document.getElementById("subscribeMsg");

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!subscribeForm.checkValidity()) {
                subscribeForm.reportValidity();
                setMessage(subscribeMessage, "subscribe-submit-message", false, "Please enter a valid email.");
                return;
            }

            var formData = new FormData(subscribeForm);
            var email = (formData.get("email") || "").trim();

            setMessage(subscribeMessage, "subscribe-submit-message", true, "Subscribing...");

            postForm(subscribeForm)
                .then(function () {
                    subscribeForm.reset();
                    setMessage(subscribeMessage, "subscribe-submit-message", true, "Subscribed successfully.");
                })
                .catch(function () {
                    openMailClient("Newsletter subscription", "Please add this email to the newsletter list:\n\n" + email);
                    setMessage(subscribeMessage, "subscribe-submit-message", true, "Opening your email app to complete subscription.");
                });
        });
    }
})();
