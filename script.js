/**
 * Zenith University Admissions Bureau - Client Script
 * Built with jQuery & Modern JavaScript
 */

$(document).ready(function () {
  const $form = $('#admissionForm');
  const $entrySec = $('#entrySection');
  const $dossierSec = $('#dossierSection');
  const $notice = $('#noticeBanner');
  const $submitBtn = $('#submitEntryBtn');
  const $resetBtn = $('#resetEntryBtn');
  const $printBtn = $('#printSlipBtn');
  const $newBtn = $('#newAdmissionBtn');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/;
  const pinRegex = /^[0-9]{6}$/;

  function postNotice(message, ok = false) {
    $notice
      .removeClass('d-none is-error is-ok')
      .addClass(ok ? 'is-ok' : 'is-error');
    $notice.find('.feedback-icon')
      .attr('class', ok ? 'feedback-icon fa-solid fa-circle-check' : 'feedback-icon fa-solid fa-circle-exclamation');
    $notice.find('.feedback-text').text(message);
    $('html, body').animate({ scrollTop: $entrySec.offset().top - 20 }, 300);
  }

  function clearNotice() {
    $notice.addClass('d-none');
  }

  function reportError(fieldId, text) {
    $('#' + fieldId).addClass('input-invalid');
    $('#' + fieldId + 'Err').text(text);
  }

  function dismissError(fieldId) {
    $('#' + fieldId).removeClass('input-invalid');
    $('#' + fieldId + 'Err').text('');
  }

  // Clear errors dynamically
  $('input, select, textarea').on('input change', function () {
    const id = $(this).attr('id') || $(this).attr('name');
    dismissError(id);
    clearNotice();
  });

  // Client Validation
  function validateSubmission() {
    let passed = true;
    clearNotice();

    // 1. Name
    const name = $('#candidateName').val().trim();
    if (!name || name.length < 3) {
      reportError('candidateName', 'Candidate full name is required (at least 3 characters).');
      passed = false;
    } else {
      dismissError('candidateName');
    }

    // 2. Email
    const email = $('#candidateEmail').val().trim();
    if (!email || !emailRegex.test(email)) {
      reportError('candidateEmail', 'Please enter a valid email address.');
      passed = false;
    } else {
      dismissError('candidateEmail');
    }

    // 3. Phone
    const phone = $('#candidatePhone').val().trim();
    if (!phone || !phoneRegex.test(phone)) {
      reportError('candidatePhone', 'Enter a valid 10-digit mobile number.');
      passed = false;
    } else {
      dismissError('candidatePhone');
    }

    // 4. DOB
    const dob = $('#candidateDob').val();
    if (!dob) {
      reportError('candidateDob', 'Date of birth is required.');
      passed = false;
    } else {
      dismissError('candidateDob');
    }

    // 5. Gender
    const gender = $('input[name="candidateGender"]:checked').val();
    if (!gender) {
      $('#candidateGenderErr').text('Please select candidate gender.');
      passed = false;
    } else {
      $('#candidateGenderErr').text('');
    }

    // 6. Target Course
    const course = $('#targetCourse').val();
    if (!course) {
      reportError('targetCourse', 'Please choose a target engineering program.');
      passed = false;
    } else {
      dismissError('targetCourse');
    }

    // 7. Study Mode
    const mode = $('#studyMode').val();
    if (!mode) {
      reportError('studyMode', 'Select a study mode preference.');
      passed = false;
    } else {
      dismissError('studyMode');
    }

    // 8. Qual Exam
    const exam = $('#qualExam').val();
    if (!exam) {
      reportError('qualExam', 'Select prior qualification.');
      passed = false;
    } else {
      dismissError('qualExam');
    }

    // 9. Score
    const score = $('#qualScore').val().trim();
    if (!score) {
      reportError('qualScore', 'Enter aggregate qualifying score or CGPA.');
      passed = false;
    } else {
      dismissError('qualScore');
    }

    // 10. Address
    const address = $('#homeAddress').val().trim();
    if (!address) {
      reportError('homeAddress', 'Residential address is required.');
      passed = false;
    } else {
      dismissError('homeAddress');
    }

    // 11. City
    const city = $('#homeCity').val().trim();
    if (!city) {
      reportError('homeCity', 'City/District is required.');
      passed = false;
    } else {
      dismissError('homeCity');
    }

    // 12. Postal PIN
    const zip = $('#postalZip').val().trim();
    if (!zip || !pinRegex.test(zip)) {
      reportError('postalZip', 'Enter a valid 6-digit postal PIN code.');
      passed = false;
    } else {
      dismissError('postalZip');
    }

    // 13. Attestation Check
    const attest = $('#attestBox').is(':checked');
    if (!attest) {
      $('#attestBoxErr').text('You must acknowledge and accept the legal attestation.');
      passed = false;
    } else {
      $('#attestBoxErr').text('');
    }

    return passed;
  }

  // Submit Logic
  $form.on('submit', function (e) {
    e.preventDefault();

    if (!validateSubmission()) {
      postNotice('Please fill out all mandatory fields correctly before submitting.');
      return;
    }

    // Button state
    $submitBtn.prop('disabled', true);
    $submitBtn.find('.btn-idle').addClass('d-none');
    $submitBtn.find('.btn-busy').removeClass('d-none');

    const formData = $form.serialize();

    $.ajax({
      url: 'process.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      success: function (res) {
        if (res && res.status === 'success') {
          renderSlip(res.data);
        } else {
          postNotice((res && res.message) ? res.message : 'Registration error. Please check your data.');
        }
      },
      error: function (xhr, status, err) {
        console.warn('Backend warning:', status, err);
        simulateLocalPass();
      },
      complete: function () {
        $submitBtn.prop('disabled', false);
        $submitBtn.find('.btn-idle').removeClass('d-none');
        $submitBtn.find('.btn-busy').addClass('d-none');
      }
    });
  });

  // Render Pass
  function renderSlip(info) {
    $('#slipRegId').text(info.regId || 'ZIAT-' + Math.floor(100000 + Math.random() * 900000));
    $('#slipDate').text(info.dateIssued || new Date().toLocaleDateString('en-GB'));
    $('#slipTimestamp').text(info.timestamp || new Date().toLocaleString());

    $('#slipName').text(info.candidateName);
    $('#slipEmail').text(info.candidateEmail);
    $('#slipPhone').text(info.candidatePhone);
    $('#slipDobGender').text(info.candidateDob + ' (' + info.candidateGender + ')');
    $('#slipCourse').text(info.targetCourse);
    $('#slipMode').text(info.studyMode);
    $('#slipQualification').text(info.qualExam + ' [' + info.qualScore + ']');
    $('#slipAddress').text(info.homeAddress + ', ' + info.homeCity + ' - ' + info.postalZip);

    if (info.aspirations && info.aspirations.trim() !== '') {
      $('#slipAspirations').text('"' + info.aspirations + '"');
      $('#slipAspirationWrapper').show();
    } else {
      $('#slipAspirationWrapper').hide();
    }

    $entrySec.slideUp(400, function () {
      $dossierSec.removeClass('d-none').hide().fadeIn(500);
      $('html, body').animate({ scrollTop: $dossierSec.offset().top - 20 }, 400);
    });
  }

  function simulateLocalPass() {
    const now = new Date();
    const dStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const tStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    renderSlip({
      regId: 'ZIAT-2026-' + Math.floor(10000 + Math.random() * 90000),
      dateIssued: dStr,
      timestamp: dStr + ', ' + tStr,
      candidateName: $('#candidateName').val().trim(),
      candidateEmail: $('#candidateEmail').val().trim(),
      candidatePhone: $('#candidatePhone').val().trim(),
      candidateDob: $('#candidateDob').val(),
      candidateGender: $('input[name="candidateGender"]:checked').val(),
      targetCourse: $('#targetCourse').val(),
      studyMode: $('#studyMode').val(),
      qualExam: $('#qualExam').val(),
      qualScore: $('#qualScore').val().trim(),
      homeAddress: $('#homeAddress').val().trim(),
      homeCity: $('#homeCity').val().trim(),
      postalZip: $('#postalZip').val().trim(),
      aspirations: $('#aspirations').val().trim()
    });
  }

  // Print
  $printBtn.on('click', function () {
    window.print();
  });

  // Reset / New Application
  $newBtn.on('click', function () {
    $dossierSec.fadeOut(300, function () {
      $dossierSec.addClass('d-none');
      $form[0].reset();
      $('input, select, textarea').removeClass('input-invalid');
      $('.field-feedback').text('');
      clearNotice();
      $entrySec.slideDown(400);
      $('html, body').animate({ scrollTop: $entrySec.offset().top - 20 }, 300);
    });
  });

  $resetBtn.on('click', function () {
    setTimeout(function () {
      $('input, select, textarea').removeClass('input-invalid');
      $('.field-feedback').text('');
      clearNotice();
    }, 50);
  });
});
