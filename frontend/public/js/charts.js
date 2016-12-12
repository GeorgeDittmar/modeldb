(function ($) {
  $.fn.findByData = function (prop, val) {
    var $self = this;
    if (typeof val === 'undefined') {
      return $self.filter(
        function () { return typeof $(this).data(prop) !== 'undefined'; }
      );
    }
    return $self.filter(
      function () { return $(this).data(prop) == val; }
    );
  };
})(window.jQuery);

$(function() {

  var xaxis = {};
  var yaxis = {};
  var vlSpec;
  var embedSpec;

  $(document).on('click', '.compare-button', function(event) {
    updateVega();
  });

  $(document).on('click', '.chart-toggle', function(event) {
    var show = $(event.target).data('show');
    if (!show) {
      $(event.target).data('show', true);
      $(event.target).html("&#9660;");
      $('.models-container').addClass('models-container-hide');
      $('.chart-container').addClass('chart-container-show');
      /*
      $('.models-container').animate({
        height: ($(window).height() - 600) + "px"
      }, 500);
      $('.chart-container').animate({
        height: "500px"
      }, 500);
      */
    } else {
      $(event.target).data('show', false);
      $(event.target).html("&#9650;");
      $('.models-container').removeClass('models-container-hide');
      $('.chart-container').removeClass('chart-container-show');
      /*
      $('.models-container').animate({
        height: ($(window).height() - 165) + "px"
      }, 500);
      $('.chart-container').animate({
        height: "50px"
      }, 500);
      */
    }
  });

  function init() {
    var kvs = $('.kv');
    for (var i=0; i<kvs.length; i++) {
      var kv = $(kvs[i]);
      if (kv.data('num')) {
        yaxis[kv.data('key')] = true;
      } else {
        xaxis[kv.data('key')] = true;
      }
    }

    for (var key in xaxis) {
      if (xaxis.hasOwnProperty(key)) {
        var option = new Option(key, key);
        $('.x-axis').append(option);
      }
    }

    for (var key in yaxis) {
      if (yaxis.hasOwnProperty(key)) {
        var option = new Option(key, key);
        $('.y-axis').append(option);
      }
    }

    console.log(xaxis);
    console.log(yaxis);
    vegaInit();
  }

  function vegaInit() {
    vlSpec = {
      "data": {
        "values": []
      },
      "mark": "bar",
      "encoding": {
        "x": {
          "type": "nominal",
          "axis": {
          }
        },
        "y": {
          "aggregate": "average",
          "type": "numeric",
          "axis": {
          }
        }
      }
    };

    embedSpec = {
      mode: "vega-lite",  // Instruct Vega-Embed to use the Vega-Lite compiler
      spec: vlSpec
    };
  }

  function updateVega() {
    var x = $('.x-axis').val();
    var y = $('.y-axis').val();

    // update values
    vlSpec.data.values = [];
    var models = $('.model');
    for (var i=0; i<models.length; i++) {
      if ($(models[i]).is(":visible")) {
        var kvs = $(models[i]).find('.kv');
        var xfield = $(kvs.findByData('key', x)[0]);
        var yfield = $(kvs.findByData('key', y)[0]);
        xfield = xfield.data('val');
        yfield = yfield.data('val');
        if (xfield && yfield) {
          var val = {};
          val[x] = xfield;
          val[y] = yfield;
          vlSpec.data.values.push(val);
        }
      }
    }

    // update axes
    vlSpec.encoding.x.field  = x;
    vlSpec.encoding.y.field = y;
    vlSpec.encoding.x.axis.title = x;
    vlSpec.encoding.y.axis.title = y;

    vg.embed(".model-chart", embedSpec, function(error, result) {
      // Callback receiving the View instance and parsed Vega spec
      // result.view is the View, which resides under the '#Barchart' element
    });
  }

  init();

});