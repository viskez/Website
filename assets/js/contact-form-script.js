(function () {
    var form = document.getElementById("contactForm");
    var messageBox = document.getElementById("msgSubmit");

    if (!form) {
        return;
    }

    function setMessage(isSuccess, text) {
        if (!messageBox) {
            return;
        }

        messageBox.className = "contact-submit-message " + (isSuccess ? "text-success" : "text-danger");
        messageBox.textContent = text;
    }

    function encodeMailBody(data) {
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

    function openMailClient(data) {
        var mailtoUrl = "mailto:corporate@viskez.com"
            + "?subject=" + encodeURIComponent(data.subject || "Website enquiry")
            + "&body=" + encodeURIComponent(encodeMailBody(data));

        window.location.href = mailtoUrl;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            setMessage(false, "Please complete all required fields.");
            return;
        }

        var formData = new FormData(form);
        var data = {
            name: (formData.get("name") || "").trim(),
            email: (formData.get("email") || "").trim(),
            phone: (formData.get("phone") || "").trim(),
            subject: (formData.get("subject") || "Website enquiry").trim(),
            message: (formData.get("message") || "").trim()
        };

        setMessage(true, "Sending message...");

        fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        })
            .then(function (response) {
                return response.json().then(function (payload) {
                    if (!response.ok || !payload.success) {
                        throw new Error(payload.message || "Unable to send message.");
                    }

                    return payload;
                });
            })
            .then(function () {
                form.reset();
                setMessage(true, "Message sent successfully.");
            })
            .catch(function () {
                openMailClient(data);
                setMessage(true, "Opening your email app to send the message.");
            });
    });
})();
