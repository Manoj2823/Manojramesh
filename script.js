// ==========================================
// Manoj Ramesh - Personal Portfolio JavaScript
// ==========================================

// ----------------- About Tab Switching -----------------
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname, evt) {
    for (var tablink of tablinks) {
        tablink.classList.remove("active-links");
    }
    for (var tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    
    // Set active class on corresponding tab link
    var targetLink = null;
    if (evt && evt.currentTarget && evt.currentTarget.classList.contains("tab-links")) {
        targetLink = evt.currentTarget;
    } else {
        targetLink = document.querySelector('.tab-links[data-tab="' + tabname + '"]');
        if (!targetLink) {
            for (var link of tablinks) {
                if (link.getAttribute("onclick") && link.getAttribute("onclick").includes("'" + tabname + "'")) {
                    targetLink = link;
                    break;
                }
            }
        }
    }
    if (targetLink) {
        targetLink.classList.add("active-links");
    }
    
    // Set active class on content
    var targetContent = document.getElementById(tabname);
    if (targetContent) {
        targetContent.classList.add("active-tab");
    }
}

// ----------------- Direct Experience Tab Navigation -----------------
function goToExperienceTab(e) {
    if (e) {
        e.preventDefault();
    }
    // Activate experience tab
    opentab('experience');
    
    // Smoothly scroll to the tab titles in About section with offset
    var tabTitles = document.querySelector('.tab-titles');
    if (tabTitles) {
        var yOffset = -90;
        var y = tabTitles.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
        var about = document.getElementById('about');
        if (about) {
            about.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Check hash on page load
window.addEventListener('DOMContentLoaded', function () {
    if (window.location.hash === '#experience') {
        goToExperienceTab();
    }
});

// ----------------- Mobile Side Menu -----------------
var sidemenu = document.getElementById("sidemenu");
function openmenu() {
    sidemenu.style.right = "0";
}
function closemenu() {
    sidemenu.style.right = "-240px";
}

// ----------------- Google Sheet Contact Form Submission -----------------
const scriptURL = 'https://script.google.com/macros/s/AKfycbyi3wodFJGRfo3CrAIr3IxrPh2aQwdp1BN_X5iBNsUVTl8FrBJVEP4VQ9CrcFK-VrNKIg/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        msg.innerHTML = "Sending message...";
        msg.style.color = "#ffaa00";

        const nameVal = (form.name ? form.name.value : (form.Name ? form.Name.value : '')).trim();
        const emailVal = (form.email ? form.email.value : (form.Email ? form.Email.value : '')).trim();
        const projectVal = (form.project ? form.project.value : (form.Messages ? form.Messages.value : (form.Message ? form.Message.value : ''))).trim();

        const params = new URLSearchParams();
        // Send matching keys for e.parameter.name, e.parameter.email, e.parameter.project
        params.append('name', nameVal);
        params.append('email', emailVal);
        params.append('project', projectVal);
        // Also send fallback keys
        params.append('Name', nameVal);
        params.append('Email', emailVal);
        params.append('Messages', projectVal);
        params.append('Message', projectVal);
        params.append('Date', new Date().toLocaleString());

        fetch(scriptURL, {
            method: 'POST',
            body: params,
            mode: 'no-cors'
        })
            .then(() => {
                msg.innerHTML = "Message sent successfully!";
                msg.style.color = "#61b752";
                form.reset();
                if (submitBtn) submitBtn.disabled = false;
                setTimeout(function () {
                    msg.innerHTML = "";
                }, 5000);
            })
            .catch(err => {
                msg.innerHTML = "Error sending message. Please try again.";
                msg.style.color = "#ff4444";
                if (submitBtn) submitBtn.disabled = false;
                console.error('Submission Error:', err);
            });
    });
}
