var studentdata;
function readcsv(input) {
    var l = String(input.value).split('.');
    var extension = l[l.length - 1].toLowerCase();
    if (extension != 'csv') {
        alert("Only CSV files are compatible");
        input.value = '';
        document.getElementById('fields').innerHTML = '';
    } else {
        var file = input.files[0];
        var reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            csvdata = $.csv.toArrays(reader.result)
            displaydatafield(csvdata);
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
    document.getElementById('fields').innerHTML = "";
}
function loaddatafromlocalstorage() {
    var data = localStorage.getItem('studentdata');
    var totaldtudent = parseInt(localStorage.getItem('totalstudents'));
    return { 'studentdata': data, 'totalstudent': totaldtudent - 1 };
}

function savetolocalstorage() {
    localStorage.setItem('studentdata', JSON.stringify(studentdata));
    localStorage.setItem('totalstudents', studentdata.length);
    alert("Saved Successfully");
    document.getElementById('fields').innerHTML = "";
}
function displaydatafield(csvdata) {
    var fields = document.getElementById('fields');
    var temp = '<table class="table" style="color:whitesmoke;">';
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

    temp += `<button type="button" class="btn btn-success" onclick="savetolocalstorage();">Save</button><br>`;


    fields.innerHTML = temp;
}
function viewrecentlysaved() {
    var data = JSON.parse(localStorage.getItem('studentdata'));
    displaydatafield(data);
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
    showtotalpresentabsentchanges();
}
var totalpresent = 0;
var totalabsent = 0;
function loadstudentdata() {
    var data = loaddatafromlocalstorage();
    var studentdata = JSON.parse(data['studentdata']);
    var totalstudents = totalabsent = data['totalstudent'];
    var fields = document.getElementById('data');
    var temp = `<div style="justify-content: space-evenly; display: flex;">
    <button type="button"
        class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
        onclick="presentorabsent('Mark Present');" id="mb2">Mark Present</button>
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
    class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored markattendencebtn" onclick="downloadattendence();">
    <i class="material-icons">done</i>
</button>`;
    fields.innerHTML = temp;
}
// loadstudentdata();

function presentabsentmark() {
    var data = loaddatafromlocalstorage();
    var studentdata = JSON.parse(data['studentdata']);
    var totalstudents = data['totalstudent'];
    studentdata[0][2] = "Status";
    for (i = 1; i < totalstudents + 1; i++) {
        if (option == "Mark Present") {
            if ($(`#${studentdata[i][1]}`).is(':checked')) {
                studentdata[i][2] = "Present";
            } else {
                studentdata[i][2] = "Absent";
            }
        } else {
            if ($(`#${studentdata[i][1]}`).is(':checked')) {
                studentdata[i][2] = "Absent";
            } else {
                studentdata[i][2] = "Present";
            }
        }
    }
    return studentdata;
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
}
function filename() {
    var today = new Date();
    var date = `${today.getDate()} ${getMonthName((today.getMonth() + 1))},${today.getFullYear()}`

    var time = today.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
    return (`${subject} | ${subjectcode} | ${date} | ${time}`);
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
    temp += `<input type="text" placeholder="Subject Name" id="subname">`;
    temp += `<input type="text" placeholder="Subject Code" id="subcode">`;
    temp += `<button type="button" class="btn btn-success" onclick="savesubject();">Add</button>`;
    document.getElementById('subjectsdata').innerHTML = temp;
}
function savesubject() {
    var data = JSON.parse(localStorage.getItem('subjects'));
    if (data == null) {
        data = [];
    }
    data.push([document.getElementById("subname").value, document.getElementById('subcode').value]);
    localStorage.setItem('subjects', JSON.stringify(data));
    displaysubjects();
}
function displaysubjects() {
    var data = JSON.parse(localStorage.getItem('subjects'));
    var temp = '';
    for (i = 0; i < data.length; i++) {
        temp += `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onclick="checkClass('${data[i][0]}','${data[i][1]}');">${data[i][0]} ${data[i][1]}</button>`;
    }
    document.getElementById("subjectsshow").innerHTML = temp;
}
displaysubjects();
var option = "Mark Present";
function presentorabsent(op) {
    if (op == "Mark Absent") {
        option = "Mark Absent";
        document.getElementById('mb1').className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
        document.getElementById('mb2').className = "mdl-button mdl-js-button mdl-button--raised";
        var temp = totalabsent;
        totalabsent = totalpresent;
        totalpresent = temp;
    } else {
        option = "Mark Present";
        document.getElementById('mb2').className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
        document.getElementById('mb1').className = "mdl-button mdl-js-button mdl-button--raised";
        var temp = totalabsent;
        totalabsent = totalpresent;
        totalpresent = temp;
    }
    showtotalpresentabsentchanges();
}