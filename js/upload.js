$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirect_uri = "https://sairish2001.github.io/present-mam-web/index.html"
    const client_secret = "BH6nA96WX3LG60HzxSPpeniX";
    const scope = "https://www.googleapis.com/auth/drive";
    var access_token = "";
    var client_id = "32404943670-lm2vtidqcri5fftggct45ofm5a1sbqse.apps.googleusercontent.com"


    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {
            code: code
            , redirect_uri: redirect_uri,
            client_secret: client_secret,
            client_id: client_id,
            scope: scope,
            grant_type: "authorization_code"
        },
        dataType: "json",
        success: function (resultData) {
            localStorage.setItem("accessToken", resultData.access_token);            
            localStorage.setItem("refreshToken", resultData.refreshToken);
            localStorage.setItem("expires_in", resultData.expires_in);
            window.history.pushState({}, document.title, "/present-mam/index.html");            
        }
    });

    var Upload = function (file) {
        this.file = file;
    };

    Upload.prototype.doUpload = function () {
        var that = this;
        var formData = new FormData();        
        formData.append("file", this.file, filename() + '.csv');
        formData.append("upload_file", true);

        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data: {
                uploadType: "media",
                title: 'uiyiyi.csv'
            },
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;
            },
            success: function (data) {
                document.getElementById("upload").innerHTML=`<i id="drivestatus" class="material-icons">file_download_done</i>`;
            },
            error: function (error) {
                document.getElementById("upload").innerHTML=`<i id="drivestatus" class="material-icons">error</i><i id="drivestatus" class="material-icons">refresh</i>`;
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };
    
    $("#upload").on("click", function (e) {
        if(document.getElementById("upload").innerText!="file_download_done"){
            var csvContent = $.csv.fromArrays(presentabsentmark());
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            var file=new File([blob], filename()+'.csv');
                var upload = new Upload(file);        
                upload.doUpload();
        }   
    });

});
