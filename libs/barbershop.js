(function($) {

  "use strict";

  /*
  barbershopjs
  */

  $.fn.barbershop = function() {

    var that = this;

    var initSortable = function() {
      $(that).sortable({
        axis: "y",
        cursor: "move",
        items: "[contenteditable], .ody-image-placeholder"
      });
    }


    $(that).find("[contenteditable]").each(function() {
      $(this).attr("data-uuid", uuid());
    });
    $(that).find(".ody-image-placeholder").each(function() {
      $(this).attr("data-uuid", uuid());
    });

    $(that)
      .css({
        position: "relative"
      })
      .append('<div id="bs-editor-overlay" style="position: absolute!important;top:0;left:0;width: 100%;height: 100%;background: transparent;z-index:-1"></div>');

    initSortable();
    $(that).droppable({});

    $(".bs-element").draggable({
      start: function() {
        initOverlay();
      },
      stop: function(e) {
        $(e.target)
          .css({
            left: "auto",
            top: "auto"
          })

      }
    });

    $("body").on("mouseover", $(that).find("[contenteditable]"), function() {
      $(this).css({
        cursor: ($(document.activeElement).data("uuid") === $(this).data("uuid")) ? "text" : "move"
      });
    });

    $(that).find("[contenteditable]")
    /* mouse down */
    .on("mousedown", function() {
      if ($(document.activeElement).data("uuid") === $(this).data("uuid")) {
        console.log("active element  = mousedown element");
        $(that).sortable("sort");
        $(that).sortable("destroy");
      } else {
        initSortable();
        console.log("active element  != mousedown element");
        console.log("active element = #" + $(document.activeElement).attr("id"));
      }
    })
    /* mouse up */
    .on("mouseup", function() {
      $(that).sortable("sort");
      $(that).sortable("destroy");
    })
    /* click */
    .on("click", function() {
      $(this).trigger("focus");
      $(this).css({
        cursor: "text"
      });
      $(that).sortable("destroy");
      console.log("active element = #" + $(document.activeElement).attr("id"));
    });

    var initOverlay = function() {
      $("#bs-editor-overlay").droppable({
        over: function(event, ui) {
          $("#bs-editor-overlay")
            .css({
              background: "hsla(334,85%,52%,.2)",
              "z-index": 8
            })
        },
        out: function(event, ui) {
          $("#bs-editor-overlay")
            .css({
              background: "transparent",
              "z-index": -1
            })
        },
        drop: function(e, ui) {
          $("#bs-editor-overlay")
            .css({
              background: "transparent",
              "z-index": -1
            })
          $(ui.draggable[0])
            .css({
              left: "auto",
              top: "auto"
            })
          var newItem = $('<article data-uuid="' + uuid() + '" class="bs-doc-textarea" contenteditable="true" spellcheck="false" class="bs-input-field" data-placeholder="Running text with paragraphs and styles.">');
          $(that).append($(newItem));
          $(newItem).focus();
          initSortable();
        }
      });

    }

    $("#button-getHandleBarsTemplate").click(function() {
      alert(getHandlebarsTemplate());
    });

    $("#button-getJSON").click(function() {
      alert(JSON.stringify(getJSONValues()));
    });

    var getJSONValues = function() {
      var jsonData = {};
      $(that).find("[contenteditable], .ody-image-placeholder").each(function() {
        var key = $(this).attr('id') || $(this).data('uuid');
        if ($(this).hasClass("ody-image-placeholder"))
          jsonData[key] = $(this).find("img").attr("src");
        else
          jsonData[key] = $(this).html().replace(/\n/g, "");
      });
      return jsonData;
    }

    var getHandlebarsTemplate = function() {
      var templateData = "";
      $(that).find("[contenteditable], .ody-image-placeholder").each(function() {

        if ($(this).hasClass("ody-image-placeholder"))
          templateData += '<img src="{{' + $(this).data('uuid') + '}}" alt="">\n';
        else
          templateData += '<div>{{' + $(this).data('uuid') + '}}</div>\n';

      });
      return templateData;
    }
  };

  var uuid = function(separator) {
    var delim = separator || "-";

    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
  };


}(jQuery));