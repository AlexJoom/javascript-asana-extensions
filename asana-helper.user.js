// ==UserScript==
// @name        Asana tasks helper
// @namespace   scify
// @include     https://app.asana.com/*
// @version     0.3.2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @updateURL   https://raw.githubusercontent.com/AlexJoom/javascript-asana-extensions/master/asana-helper.user.js
// ==/UserScript==
window.setInterval(function () {
  if ($('#project_notes').length > 0 && $("#project_title").text().toLowerCase().indexOf("backlog")==-1) {
    if ($('#scify-hours').length == 0)
    {
      $(getTemplate()).insertAfter('#project_notes .loading-boundary');
      addGlobalStyle(getStyles());
    }
    getHoursPerName();
  }
}, 2000);
function getHoursPerName() {
  $('#scify-hours').find('#as-helper-allocation').find('.data-entry').remove();
  var persons = [
  ];
  var hours = [
  ];
  var total = 0;
  $('#grid').find('tr').each(function (i, row) {
    var taskName = $(row).find('textarea').val();
    try {
      if (taskName.indexOf('|') > 0) {
        var taskhours = parseFloat(taskName.substring(0, taskName.indexOf('|')).replace('h', ''));
        if (taskhours > 0) {
          total += taskhours;
          var profilePhoto = $(row).find('.profile-photo');
          if (profilePhoto.length > 0) {
            var img = profilePhoto.css('backgroundImage');
            var index = $.inArray(img, persons);
            if (index == - 1) {
              persons.push(img);
              console.log(profilePhoto.html());
              $('#scify-hours').find('#as-helper-allocation').append('<tr class=\'data-entry\'><td class=\'photo\'></td><td class=\'data\'></td></tr>');
              index = $.inArray(img, persons);
              hours[index] = 0;
            }
            hours[index] += taskhours;
          }
        }
      }
    } 
    catch (err) {
    }
  });
  $('#scify-hours').find('.data-entry').each(function (i, row) {
    $(row).find('.photo').append('<div style=\'width:21px;height:21px;background:' + persons[i] + '\'></div>');
    $(row).find('.data').append(hours[i] + 'h');
  });
  $('#scify-hours').find('.total').text(total);
}
function getTemplate() {
  return '<div id=\'scify-hours\'>' +
  '<table>' +
  '<tr><td style=\'border-right: 2px solid gray;vertical-align:middle;text-align:center;font-size:18px;\'>Total</br> <span class=\'total\'></span>h</td>' +
  '<td>' +
  '<table id=\'as-helper-allocation\'>' +
  '<tr><td>Name</td><td>Remaining</td></tr>' +
  '</table>' +
  '</td></tr>' +
  '</table>' +
  + '</div>';
}
function getStyles()
{
  return ' #project_notes{ font-size:12px}' +
  ' #scify-hours td:first-child { padding-right: 12px;}' +
  ' .total { color: blue; font-weight: bold;}' +
  ' #as-helper-allocation{margin-left:5px;}' +
  ' #scify-hours { border-top: 1px solid gray;padding: 7px;}';
}
function addGlobalStyle(css) {
  var head,
  style;
  head = document.getElementsByTagName('head') [0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}
