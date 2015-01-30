// ==UserScript==
// @name        Asana tasks helper
// @namespace   scify
// @include     https://app.asana.com/*
// @version     0.5.6
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==
var parentId="1";

function allowDrop(ev) {
	ev.preventDefault();
	ev.target.addClass('scify-container-hovered');
}

function hideDrop(ev) {
    	ev.preventDefault();
    	ev.target.removeClass('scify-container-hovered');
}

function drag(ev) {
	ev.dataTransfer = ev.originalEvent.dataTransfer;
	ev.dataTransfer.setData('text/html', ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	ev.dataTransfer = ev.originalEvent.dataTransfer;
	var data = ev.dataTransfer.getData("text/html");
	ev.target.appendChild(document.getElementById(data));
	$('.scify-container-hovered').removeClass('scify-container-hovered');
	parentId = $(ev.target).data()["id"];
}

/*function to check if the task title has the actual working hours*/
function checkTaskTitle () {
    $('#grid').find('tr').each(function (i, row) {
        try {
           var taskName = $(row).find('textarea').val();
           if(typeof(taskName) != "undefined") {
               if(taskName.indexOf("[") == -1 || taskName.indexOf("]") == -1 ) {
                   $(row).find("span:first-child").hide();
                   $(row).find(".scify-warning").remove();
                   $(row).find(".show-details").show();
                   $(row).find(".grid_cell_boolean").append('<span class="scify-warning"><i class="fa fa-exclamation-triangle"></i></span>');
                   $(row).find(".scify-warning").parent().css("padding-top","10px");
                   $(".more-detail").find(".scify-warning").remove();
                   
                   /*code to fix hidden assignee span bug*/
                   $(".assignee").show();
                   /*code to fix hidden bar input (e.g. email) rows bug*/
                   $(".bar-container").show();
                   $(".bar_input_span").show();
                   $(".bar_input_span").children().show();
                   
               }
               else {
                   $(row).find("span").show();
                   $(row).find(".scify-warning").remove();
                   $(row).find(".checkmark").hide();
               }
           }
        }
        catch(err) {
        }
    });
}

window.setTimeout(function() {
	addGlobalStyle(getStyles());
			
  
    
	$(".priority").click(function(e){   
		    console.log( "inside priority!" );
      e.stopPropagation();
      
      return false;
   });
    

	window.setInterval(function () {
         
	    /*Code to change the background color of the Backlog tasks in Sprint*/
	    var projectTitle = $(".header-name").text();
	    if(projectTitle.indexOf("Sprint") != -1) {  
		     /*the title must be checked on every interval*/
		     checkTaskTitle();
		     var projectName = projectTitle.substr(0, projectTitle.indexOf(" "));
		     $(".grid-tags-and-date:contains('" +projectName + "')").parents(".grid_cell_string").css("background-color","#F2E5FF");    
	    }
      
	    //console.log("found:" + $(".unchecked").length);
	    if ($('#project_title').length <= 0 || $("#project_title").text().toLowerCase().indexOf("backlog")!=-1) {
	            return;
	    }
	    $('.scify-container').remove();
	    addContainers();
	    $(getTemplate()).appendTo($('.scify-container')[parentId]);
	    $('#scify-hours').on('dragstart', function(ev){drag(ev);});
	    getHoursPerName();
    	}, 2000);
}, 4000);

function addContainers() {
	var container = '<div class="scify-container"></div>';
	$('#project_notes .loading-boundary').append(container);
	$('#right_pane').append(container);
	$('.scroll-container.scroll-area.domain-scroll-area.greyable-area-contents').append(container);
	$('.search-header-row-view').after(container);
	$('.pot-header-row-view').after(container);
	$('.scify-container').each(function(i, cur) {
		$(cur).data("id", i);
	});
	var cur = $('.scify-container');
	cur.on('dragover', function(ev){allowDrop(ev);});
	cur.on('dragleave', function(ev){hideDrop(ev);});
	cur.on('drop', function(ev){drop(ev);});
}

function getHoursPerName() {
    $('#scify-hours').find('#as-helper-allocation').find('.data-entry').remove();
    var persons = [
    ];
    var hours = [
    ];
    var total = 0;
    var unassigned = 0;
    $('#grid').find('tr').each(function (i, row) {
        var taskName = $(row).find('textarea').val();
        try {
            if (taskName.indexOf('|') > 0) {
                var taskhours = parseFloat(taskName.substring(0, taskName.indexOf('|')).replace('h', ''));
                if (taskhours > 0) {
                    total += taskhours;
                    var profilePhoto = $(row).find('.profile-photo');
                    var initials = $(row).find('.initials-text');
                    if (profilePhoto.length > 0) {
                        var img = profilePhoto.css('backgroundImage');
                        var index = $.inArray(img, persons);
                        if (index == - 1) {
                            persons.push(img);
                            $('#scify-hours').find('#as-helper-allocation').append('<tr class=\'data-entry\'><td class=\'photo\'></td><td class=\'data\'></td></tr>');
                            index = $.inArray(img, persons);
                            hours[index] = 0;
                        }
                        hours[index] += taskhours;
                    } else if (initials.length > 0) {
                        var inits = initials.html();
                        var index = $.inArray(inits, persons);
                        if (index == -1) {
                            persons.push(inits);
                            $('#scify-hours').find('#as-helper-allocation').append('<tr class=\'data-entry\'><td class=\'photo\'></td><td class=\'data\'></td></tr>');
                            index = $.inArray(inits, persons);
                            hours[index] = 0;
                        }
                        hours[index] += taskhours;
                    } else {
                        unassigned += taskhours;
                    }
                }
            }
        } 
        catch (err) {
        }
    });
    if (unassigned > 0) {
    	$('#scify-hours').find('#as-helper-allocation').append('<tr class=\'data-entry\'><td class=\'photo\'></td><td class=\'data\'></td></tr>');
    }
    $('#scify-hours').find('.data-entry').each(function (i, row) {
        if (i >= persons.length) {
            console.log(unassigned);
            $(row).find('.photo').append('UN');
            $(row).find('.data').append(unassigned + 'h');
            return;
        }
        if (persons[i].length > 2) {
            $(row).find('.photo').append('<div style=\'width:21px;height:21px;background:' + persons[i] + '\'></div>');
        } else {
            $(row).find('.photo').append(persons[i]);
        }
        $(row).find('.data').append(hours[i] + 'h');
    });
    $('#scify-hours').find('.total').text(total);
}

function getTemplate() {
	return '<div id="scify-hours" draggable="true">' +
        '<table>' +
        '<tr><td style="border-right: 2px solid gray;vertical-align:middle;text-align:center;font-size:18px;">Total</br> <span class="total"></span>h</td>' +
        '<td>' +
        '<table id="as-helper-allocation">' +
        '<tr><td>Name</td><td>Remaining</td></tr>' +
        '</table>' +
        '</td></tr>' +
        '</table>' +
        '</div>';
}

function getStyles() {
	return ' #project_notes{ font-size:12px}' +
        ' #scify-hours td:first-child { padding-right: 12px;}' +
        ' .total { color: blue; font-weight: bold;}' +
        ' #as-helper-allocation{margin-left:5px;}' +
        ' #scify-hours { border-top: 1px solid gray;padding: 7px;}' +
        ' .scify-container { min-height: 10px;}' +
        ' .scify-container-hovered { min-height: 20px; border: 1px solid grey;}';
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
	/*add awesome font css*/
    	$("head link[rel='stylesheet']").last().after("<link rel='stylesheet' href='//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'>");
}
