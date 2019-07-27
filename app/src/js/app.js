
var app = {
    init: function(){
        // console.log('ciccio');
    },
    track: function(action,category,label,value) {
        if (typeof ga !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }
    },
}


jQuery(document).ready(function(){
    app.init();
});




jQuery(window).scroll(function() {
    app.track('Scroll event','page','to','bottom');
})