  function checkPsw(form) {
  if (form.psw.value != form.confirmpsw.value)
  {
    $('#registerinfo').html("<font color='red'> Password does not match</font>");
    return false;
  } else {
    return true;
  }
}
