var studentdata;
function readcsv(input) {
    var l = String(input.value).split('.');
    var extension = l[l.length - 1].toLowerCase();
    if (extension != 'csv') {
        alert("Only CSV files are compatible");
        input.value = '';
        document.getElementById('data2nd').innerHTML = '';
    } else {
        var file = input.files[0];
        var reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            csvdata = $.csv.toArrays(reader.result)
            displaydatafield(csvdata, true, 'data3rd');
            // studentdata=$.csv.toObjects(reader.result);
            studentdata = csvdata;
        };

        reader.onerror = function () {
            console.log(reader.error);
        };
    }
}
function cleardata() {
    localStorage.clear();
    document.getElementById('data2nd').innerHTML = "";
    document.getElementById('deletedialog').close();
    showtoast("Student and Subject Data Deleted");
}
function loaddatafromlocalstorage() {
    var data = localStorage.getItem('studentdata');
    var totaldtudent = parseInt(localStorage.getItem('totalstudents'));
    return { 'studentdata': data, 'totalstudent': totaldtudent - 1 };
}

function savetolocalstorage() {
    localStorage.setItem('studentdata', JSON.stringify(studentdata));
    localStorage.setItem('totalstudents', studentdata.length);
    showtoast('Saved Students List')
    document.getElementById('data3rd').innerHTML = "";
    document.getElementById('csvfile').value = '';
}


function displaydatafield(csvdata, showbtn, elid) {
    var fields = document.getElementById(elid);
    var temp = '<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp" style="width:100%;text-align:center;">';
    var len = csvdata.length;
    temp += "<tr><th>Sr No.</th>";
    for (i = 0; i < csvdata[0].length; i++) {
        temp += `<th>${csvdata[0][i]}</th>`;
    }
    temp += "</tr>";

    for (i = 1; i < len; i++) {
        temp += `<tr><td>${i}</td>`
        for (j = 0; j < csvdata[i].length; j++) {
            temp += `<td>${csvdata[i][j]}</td>`;
        }
        temp += "</tr>";
    }
    temp += "</table>";

    if (showbtn) {
        temp += `<button type="button"
    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored markattendencebtn" onclick="savetolocalstorage();">
    <i class="material-icons">save</i>
</button>`;
    }

    fields.innerHTML = temp;
}
function viewrecentlysaved() {
    var data = JSON.parse(localStorage.getItem('studentdata'));
    if (data == null) {
        document.getElementById('data2nd').innerHTML = `<button type="button" onclick="document.getElementById('settingsbtn').click();" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent alertbtn">Go to Settings to add Data</button>`
    } else {
        displaydatafield(data, false, 'data2nd');
    }
}
function showtotalpresentabsentchanges() {
    document.getElementById('presentshow').innerText = `Present : ${totalpresent}`;
    document.getElementById('absentshow').innerText = `Absent : ${totalabsent}`;
}
function addclasstome(id) {
    if ($(`#${id}`).is(':checked')) {
        $(`#${id}label`).addClass("pinkme");
        if (option == "Mark Absent") {
            totalpresent--;
            totalabsent++;
        } else {
            totalpresent++;
            totalabsent--;
        }
    } else {
        $(`#${id}label`).removeClass("pinkme");
        if (option == "Mark Absent") {
            totalpresent++;
            totalabsent--;
        } else {
            totalpresent--;
            totalabsent++;
        }
    }
    document.getElementById('drivestatus').innerText="add_to_drive";
    showtotalpresentabsentchanges();
}
function checkbeforesaveattendence(totalstudents) {
    var data = `<div style="display: flex; justify-content: space-evenly; padding-top: 1rem; padding-bottom: 1rem;">
    <span class="mdl-chip">
        <span class="mdl-chip__text" id="presentshow">Present : ${totalpresent}</span>
    </span>
    <span class="mdl-chip">
        <span class="mdl-chip__text" id="totalshow">Total : ${totalstudents}</span>
    </span>
    <span class="mdl-chip">
        <span class="mdl-chip__text" id="absentshow">Absent : ${totalabsent}</span>
    </span>
</div>`    
    document.getElementById('finalattendencedialogdata').innerHTML = data;
    document.getElementById('finalattendencedialog').showModal();
}

var totalpresent = 0;
var totalabsent = 0;
function loadstudentdata(data) {
    var studentdata = JSON.parse(data['studentdata']);
    var previousdata = JSON.parse(localStorage.getItem('previousattendence'));
    var temp = "";
    if (studentdata != null) {
        var temp2='';
        if (previousdata != null) {
            var temp2 = `
            <button type="button" onclick="loadfrompreviousattendence();" class="mdl-button mdl-js-button mdl-button--accent markpreviousbtn">
            <i class="material-icons">restore</i>
            </button>`
        }
        var totalstudents = totalabsent = data['totalstudent'];
        var fields = document.getElementById('data');
        temp += `<span class="subjectheading">${subject} ${subjectcode}</span>`
        temp += `<div style="justify-content: space-evenly; display: flex;">
    <button type="button"
        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
        onclick="presentorabsent('Mark Present');" id="mb2">Mark Present</button>
        ${temp2}
    <button type="button" class="mdl-button mdl-js-button mdl-button--raised"
        onclick="presentorabsent('Mark Absent');" id="mb1">Mark Absent</button>

</div>
<div style="display: flex; justify-content: space-evenly; padding-top: 1rem; padding-bottom: 1rem;">
    <span class="mdl-chip">
        <span class="mdl-chip__text" id="presentshow">Present : 0</span>
    </span>
    <span class="mdl-chip">
        <span class="mdl-chip__text" id="totalshow">Total : ${totalstudents}</span>
    </span>
    <span class="mdl-chip">
        <span class="mdl-chip__text" id="absentshow">Absent : ${totalstudents}</span>
    </span>
</div>`;
        fields.innerHTML = temp;
        showtotalpresentabsentchanges();
        for (i = 1; i < totalstudents + 1; i++) {
            temp += `<label for="${studentdata[i][1]}" class="mdl-button mdl-js-button mdl-button--raised studentlist" style="font-size: 1rem;height: 5rem;margin-bottom: 1rem;" id="${studentdata[i][1]}label">${studentdata[i][0]}<br> ${studentdata[i][1]}</label>
                <input type="checkbox" style="display:none;" id="${studentdata[i][1]}" onchange="addclasstome(this.id)"><br>`;
        }
        temp += `<button type="button"
    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored markattendencebtn" onclick="checkbeforesaveattendence('${totalstudents}');">
    <i class="material-icons">done</i>
</button>`;

        temp += `<button type="button" onclick="displaysubjects();" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
Change Subject
</button>`
    } else {
        var temp = `<button type="button" onclick="document.getElementById('settingsbtn').click();" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent alertbtn">Go to Settings to add Data</button>`;
    }
    fields.innerHTML = temp;
}


function presentabsentmark() {
    var data = loaddatafromlocalstorage();
    var studentdata = JSON.parse(data['studentdata']);
    var totalstudents = data['totalstudent'];
    studentdata[0][2] = "Status";
    var cntpresent=0;
    var cntabsent=0;
    for (i = 1; i < totalstudents + 1; i++) {
        if (option == "Mark Present") {
            if ($(`#${studentdata[i][1]}`).is(':checked')) {
                studentdata[i][2] = "Present";
                cntpresent++;
            } else {
                studentdata[i][2] = "Absent";
                cntabsent++;
            }
        } else {
            if ($(`#${studentdata[i][1]}`).is(':checked')) {
                studentdata[i][2] = "Absent";
                cntabsent++;
            } else {
                studentdata[i][2] = "Present";
                cntpresent++;
            }
        }

    }
    localStorage.setItem('previousattendence', JSON.stringify(studentdata));
    var ar=[cntpresent,cntabsent,option];
    localStorage.setItem('previousattendencenumberdata', JSON.stringify(ar));
    return studentdata;
}
function loadfrompreviousattendence() {
    var data = JSON.parse(localStorage.getItem('previousattendence'));    
    var datanum = JSON.parse(localStorage.getItem('previousattendencenumberdata'));
    
    
    option=datanum[2];        
    if(option=="Mark Present"){
        totalpresent=datanum[1];
        totalabsent=datanum[0];
    }else{
        totalpresent=datanum[0];
        totalabsent=datanum[1];
    }
    presentorabsent(option);    

    var len = data.length;

    if (option == "Mark Absent") {
        for (var i = 0; i < len; i++) {
            if (data[i][2] == "Absent") {
                $(`#${data[i][1]}label`).addClass("pinkme");
                document.getElementById(data[i][1]).checked = true;
            }
        }
    } else {
        for (var i = 0; i < len; i++) {
            if (data[i][2] == "Present") {
                $(`#${data[i][1]}label`).addClass("pinkme");
                document.getElementById(data[i][1]).checked = true;
            }
        }
    }

}

function getMonthName(index) {
    switch (index) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
    }
}
var subject;
var subjectcode;
function checkClass(name, code) {
    subject = name;
    subjectcode = code;
    var subjects = JSON.parse(localStorage.getItem('subjects'));
    for (i of subjects) {
        if (code == i[1]) {
            document.getElementById(`${i[1]}`).className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
        } else {
            document.getElementById(`${i[1]}`).className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect";
        }
    }
}
function calculatepresentabsent(data, len){
    return [present, absent];
}
function filename() {
    var today = new Date();
    var date = `${today.getDate()} ${getMonthName((today.getMonth() + 1))},${today.getFullYear()}`

    var time = today.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
    return (`${subject} (${subjectcode}) - ${date} - ${time}`);
}
function downloadattendence() {
    var csvContent = $.csv.fromArrays(presentabsentmark());
    var pom = document.createElement('a');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', filename() + '.csv');
    pom.click();
}

function addsubjects() {
    var temp = '';
    temp += `<div class="mdl-textfield mdl-js-textfield">
    <input class="mdl-textfield__input" type="text" id="subname">
    <label class="mdl-textfield__label" for="subname">Subject Name</label>
  </div>`;

    temp += `<div class="mdl-textfield mdl-js-textfield">
    <input class="mdl-textfield__input" type="text" id="subcode">
    <label class="mdl-textfield__label" for="subcode">Subject Code</label>
  </div>`;

    temp += `
    <button type="button" onclick="savesubject();" class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
      <i class="material-icons">add</i>
    </button>`;
    document.getElementById('data3rd').innerHTML = temp;
}
function savesubject() {
    var data = JSON.parse(localStorage.getItem('subjects'));
    if (data == null) {
        data = [];
    }
    data.push([document.getElementById("subname").value, document.getElementById('subcode').value]);
    localStorage.setItem('subjects', JSON.stringify(data));
    showtoast(`${document.getElementById("subname").value} added`);
    document.getElementById("subname").value = '';
    document.getElementById("subcode").value = '';
    document.getElementById("data3rd").innerHTML = '';
}
function displaysubjects() {
    subjectcode = subject = null;
    var data = JSON.parse(localStorage.getItem('subjects'));
    if (data != null) {
        var temp = '';
        for (i = 0; i < data.length; i++) {
            temp += `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" style="font-size: 1rem;height: 5rem;margin-bottom: 1rem; width: 60%;" onclick="checkClass('${data[i][0]}','${data[i][1]}');" id="${data[i][1]}">${data[i][0]} <br> ${data[i][1]}</button><br>`;
        }
        temp += `
    <button type="button" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect" onclick="checktoloadstudentdata();">
      <i class="material-icons">navigate_next</i>
    </button>
    `} else {
        var temp = `<button type="button" onclick="document.getElementById('settingsbtn').click();" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent alertbtn">Go to Settings to add Data</button>`;
    }
    document.getElementById("data").innerHTML = temp;
}
displaysubjects();

function showtoast(messageshow) {
    var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = { message: messageshow };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
};

function checktoloadstudentdata() {
    if (subject == null) {
        showtoast("Select Subject");
    } else {
        loadstudentdata(loaddatafromlocalstorage());
    }
}
var option = "Mark Present";
function presentorabsent(op) {
    if (op == "Mark Absent") {
        option = "Mark Absent";
        
        document.getElementById('mb1').disabled=true;
        document.getElementById('mb2').disabled=false;
        document.getElementById('mb2').className = "mdl-button mdl-js-button mdl-button--raised";

        var temp = totalabsent;
        totalabsent = totalpresent;
        totalpresent = temp;
    } else {
        option = "Mark Present";        
        document.getElementById('mb1').className = "mdl-button mdl-js-button mdl-button--raised";
        document.getElementById('mb1').disabled=false;
        document.getElementById('mb2').disabled=true;
        var temp = totalabsent;
        totalabsent = totalpresent;
        totalpresent = temp;
    }
    showtotalpresentabsentchanges();
}

