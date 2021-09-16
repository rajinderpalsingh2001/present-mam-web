$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirect_uri = "http://localhost:5500/index.html"
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
            console.log(resultData.name)            
            localStorage.setItem("refreshToken", resultData.refreshToken);
            localStorage.setItem("expires_in", resultData.expires_in);
            window.history.pushState({}, document.title, "/index.html");            
        }
    });

    var Upload = function (file) {
        this.file = file;
    };

    Upload.prototype.doUpload = function () {
        var that = this;
        var formData = new FormData();
        console.log(this.file)
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
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };

    Upload.prototype.progressHandling = function (event) {
        var percent = 0;
        var position = event.loaded || event.position;
        var total = event.total;
        var progress_bar_id = "#progress-wrp";
        if (event.lengthComputable) {
            percent = Math.ceil(position / total * 100);
        }

        $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
        $(progress_bar_id + " .status").text(percent + "%");
    };

    $("#upload").on("click", function (e) {        
    var csvContent = $.csv.fromArrays(presentabsentmark());
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var file=new File([blob], filename()+'.csv');
        var upload = new Upload(file);        
        upload.doUpload();
    });

});