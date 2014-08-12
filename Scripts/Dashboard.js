var insta = insta || {};


insta.InstagramItem = function(item,imageResolutionSelection) {
    var self = this;
    self.low_res_url = item.images.low_resolution.url;
    self.thumbs_url = item.images.thumbnail.url;
    self.standard_resolution = item.images.standard_resolution.url;
    self.imageResolutionSelection = imageResolutionSelection;
    self.likeCount = ko.observable(item.likes.count);
    var urlToUse = "";
    if (self.imageResolutionSelection()=="low") {
        urlToUse = self.low_res_url;
    } else if (self.imageResolutionSelection() == "standard") {
        urlToUse = self.standard_resolution;
    } else {
        urlToUse = self.thumbs_url;
    }

    self.url = ko.observable(urlToUse);
    // Subscribe to changes, if the setting changes swap thumbs...
    self.imageResolutionSelection.subscribe(function (imageResolution) {
        if (imageResolution=="standard") {
            self.url(self.standard_resolution);
        } else if (imageResolution == "low") {
            self.url(self.low_res_url);
        } else {
            self.url(self.thumbs_url);
        }
    });
}

insta.AppModel = function(oauthCode) {
    var self = this;
    self.ClientIdKey = "";
    self.InstagramPopularUrl = "https://api.instagram.com/v1/media/popular?client_id=";

    self.imageRes = ko.observable("thumb");

    // Defined the model.
    self.IGImages = ko.observableArray([]);
    self.RefreshItems = function () {
        self.fetchImages();
    }

    self.dataBind = function (sectionId) {
        ko.applyBindings(self, $(sectionId)[0]);
    };

    self.dataReceived = function(results) {
        var instagramItems = results.data;
        var newItems = [];
        for (var index = 0; index < instagramItems.length; index++) {
            var item = new insta.InstagramItem(instagramItems[index], self.imageRes);
            newItems.push(item);
        }
        self.IGImages(newItems);
    };

    self.fetchImages = function () {

        var instagramUrl = self.InstagramPopularUrl + self.ClientIdKey + "&callback=?";
        $.ajax({
            url: instagramUrl,
            type: "GET",
            dataType: "jsonp",
            success:function(result) {
                self.dataReceived(result);
            },
            error:function(jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
        });

    };


};




insta.getQueryParameter = function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    alert('Query Variable ' + variable + ' not found');
}

$(function () {

   // var oathCode = insta.getQueryParameter("code");

    var model = new insta.AppModel(null);
    model.dataBind("#instagramContentId");

    model.fetchImages();


});
