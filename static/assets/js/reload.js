(function ($) {
    $(document).ready(function () {
        function poll() {
            $.ajax({
                url: '',
                success: function(){
                    location.reload();
                },
                error: function () {
                    setTimeout(poll, 1000);
                }
            });
        }

        if (location.hostname !== "localhost") {
            poll();
        }
    });
})(jQuery);
