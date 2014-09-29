javascript-asana-extensions 
===========================
Asana has missing features when it comes to scrum development. Its not possible to add hour estimations on a task and sum these per person. This is very helpful in order to find out if the team allocation for a given sprint is fine or you need to make adjustments.

We've spend a couple of hours creating a greasemonkey script that does this for you, based on naming conventions.

1. Download greasemonkey 
2. Create a new script by copy-pasting the asana-helper.js
3. Name your tasks like
     "5h | Create birthday cake"
     "2h | Buy the present" 

and the total hours per person will be calculated and presented in the top of the page, under the project's description.


Projects that contain the word "backlog" are ignored by the script. Backlog ussually contain user stories that will be added in future sprints. So it doesnt make any sense to calculate total hours in backlogs
