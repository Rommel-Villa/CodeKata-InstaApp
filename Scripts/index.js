


var insta = insta || {};
insta.LoginModel = function() {
    var self = this;
    self.ClientIdKey = "";

    self.ClientID = ko.observable(self.ClientIdKey);
    self.RedirectUrl = ko.observable("http://InstaApp.TravelAlberta.com/Dashboard.html");
    self.LoginClick = function() {
        var instagramLoginUrl = "https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code";
        instagramLoginUrl = instagramLoginUrl.replace("CLIENT-ID", self.ClientID());
        instagramLoginUrl = instagramLoginUrl.replace("REDIRECT-URI", self.RedirectUrl());
        window.location = instagramLoginUrl;

    };
    self.dataBind = function(sectionId) {
        ko.applyBindings(self, $(sectionId)[0]);
    };
}


$(function (){
    var model = new insta.LoginModel();
    model.dataBind("#loginSection");
});