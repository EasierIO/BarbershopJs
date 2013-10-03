(function($) {

  /*
  window event listeners
  */

  $.fn.barbershop = function() {

    var that = this;

    $(that).sortable({
      axis: "y",
      cursor: "move"
    });

    $("[contenteditable]").on("mouseover", function() {
      $(this).css({
        cursor: ($(document.activeElement).attr("id") === $(this).attr("id")) ? "text" : "move"
      });
    });

    $("[contenteditable]").on("mousedown", function() {
      if ($(document.activeElement).attr("id") === $(this).attr("id")) {
        console.log("active element  = mousedown element");
        $(that).sortable("sort");
        $(that).sortable("destroy");
      } else {
        $(that).sortable({
          axis: "y",
          cursor: "move"
        });
        console.log("active element  != mousedown element");
        console.log("active element = #" + $(document.activeElement).attr("id"));
      }
    });

    $("[contenteditable]").mouseup(function() {
      $(that).sortable("sort");
      $(that).sortable("destroy");
    });

    $("[contenteditable]").click(function() {
      $(this).trigger("focus");
      $(this).css({
        cursor: "text"
      });
      $(that).sortable("destroy");
      console.log("active element = #" + $(document.activeElement).attr("id"));
    });
  };

}(jQuery));