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
            studentdata=csvdata;
        };

        reader.onerror = function () {
            console.log(reader.error);
        };
    }
}
function cleardata(){
    localStorage.clear();
    document.getElementById('fields').innerHTML="";
}
function loaddatafromlocalstorage(){    
    var data=localStorage.getItem('studentdata');
    var totaldtudent=parseInt(localStorage.getItem('totalstudents'));        
    return {'studentdata':data, 'totalstudent':totaldtudent-1};
}

function savetolocalstorage(){    
    localStorage.setItem('studentdata', JSON.stringify(studentdata));        
    localStorage.setItem('totalstudents',studentdata.length);
    alert("Saved Successfully");
    document.getElementById('fields').innerHTML="";
}
function displaydatafield(csvdata) {        
    var fields = document.getElementById('fields');
    var temp='<table class="table" style="color:whitesmoke;">';
    var len=csvdata.length;    
    temp+="<tr><th>Sr No.</th>";
    for(i=0;i<csvdata[0].length;i++){
        temp+=`<th>${csvdata[0][i]}</th>`;
    }
    temp+="</tr>";
    
    for(i=1;i<len;i++){
        temp+=`<tr><td>${i}</td>`
        for(j=0;j<csvdata[i].length;j++){            
            temp+=`<td>${csvdata[i][j]}</td>`;                
        }
        temp+="</tr>";
    }
    temp+="</table>";

    temp+=`<button type="button" class="btn btn-success" onclick="savetolocalstorage();">Save</button>`;

    console.log(len-2);
    fields.innerHTML = temp;
}
function viewrecentlysaved(){
    var data=JSON.parse(localStorage.getItem('studentdata'));
    displaydatafield(data);
}

function loadstudentdata(){
    var data=loaddatafromlocalstorage();
    var studentdata=JSON.parse(data['studentdata']);
    var totalstudents=data['totalstudent'];
    var fields=document.getElementById('data');
    var temp=`Total Students : ${totalstudents}<br> `;
    for(i=1;i<totalstudents+1;i++){
        temp+=`<label for="${studentdata[i][1]}">${studentdata[i][0]}</label>
                <input type="checkbox" id="${studentdata[i][1]}"><br>`;
    }
    temp+=`<button type="button" class="btn btn-primary" onclick=presentabsentmark();>Mark Attendence</button>`
    fields.innerHTML=temp;
}
loadstudentdata();

function presentabsentmark(){
    var data=loaddatafromlocalstorage();
    var studentdata=JSON.parse(data['studentdata']);
    var totalstudents=data['totalstudent'];
    var fields=document.getElementById('data');
    studentdata[0][2]="Status";
    for(i=1;i<totalstudents+1;i++){
        if($(`#${studentdata[i][1]}`).is(':checked')){
            studentdata[i][2]="Present";
        }else{
            studentdata[i][2]="Absent";
        }
    }
    console.log(studentdata);
}

function downloadattendence(){
    $.csv.fromArrays(arrays);
}