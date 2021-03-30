$(document).ready(function() {

    $(".submit-widget-newsletter").click(function(e){
        e.preventDefault();

        let th = $(this),
            email = th.parent().find('.newsletter-input').val(),
            controller = th.data('controller')+'.php';
        
        if (email == '') {

            popup.showPopup({"state":"error", "text": "The email address is empty"});
            
        } else if (isEmail(email)) {
            $.ajax({
                type: "POST",
                headers: { "cache-control": "no-cache" },
                async: false,
                url: prestashop.urls.base_url+'modules/pspagebuilder/controllers/front/newsletter_ajax.php',
                data: "email="+email,
                success: function(data) {
                    if (data) {
                        var resp = jQuery.parseJSON(data);
                        $('body').pkPopup(resp);
                    }
                }
            });
        } else {
            $('body').pkPopup({action: 'show', state:"error", text: "Invalid email address"});
        }

    });


    // youtube lazy load
    (function() {
        var v = document.getElementsByClassName("youtube-player");
        for (var n = 0; n < v.length; n++) {
            var p = document.createElement("div");
            p.innerHTML = labnolThumb(v[n].dataset.id);
            p.onclick = labnolIframe;
            v[n].appendChild(p);
        }
    })();

    function labnolThumb(id) {
        return '<div class="w-100 youtube-thumb flex-container align-items-center justify-content-center" style="background-image:url(//i.ytimg.com/vi/' + id + '/hqdefault.jpg);"><svg class="svgic smooth02"><use xlink:href="#si-youtube-button"></use></svg></div>';
    }

    function labnolIframe() {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "//www.youtube.com/embed/" +
            this.parentNode.dataset.id + "?  autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&controls=0&showinfo=0");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("id", "youtube-iframe");
        this.parentNode.replaceChild(iframe, this);
    }

});