function connect($c1, $c2, color, thickness) {
    var center1 = { top: parseFloat($c1.attr('cy'), 10), left: parseFloat($c1.attr('cx'), 10) };
    var center2 = { top: parseFloat($c2.attr('cy'), 10), left: parseFloat($c2.attr('cx'), 10) };

    // first circle
    var x1 = center1.left;
    var y1 = center1.top;
    // second circle
    var x2 = center2.left;
    var y2 = center2.top;

    var c1Radius = parseFloat($c1.attr('r'), 10);
    var c2Radius = parseFloat($c2.attr('r'), 10) + 10 /* 10 is the margin triangle */;

    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

    var cos = Math.cos(angle * Math.PI / 180);
    var sin = Math.sin(angle * Math.PI / 180);

    var c1adjacent = cos * c1Radius;
    var c1opposite = sin * c1Radius;

    var c2adjacent = cos * c2Radius;
    var c2opposite = sin * c2Radius;

    x1 += -(c1adjacent);
    y1 += -(c1opposite);

    x2 += (c2adjacent);
    y2 += (c2opposite);


    // distance
    //var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    
    /*
    if(x1 > x2) { // pointing left
        x1 -= c1adjacent;
        y1 -= c1opposite;

        x2 += c2adjacent;
        y2 += c2opposite;
    } else if(x1 < x2) { // pointing right
        x1 -= c1adjacent;
        y1 -= c1opposite;

        x2 += c2adjacent;
        y2 += c2opposite;
    }
    */

    /*
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
    */
    // make arrow
    function getRandomArbitary (min, max) {
        return Math.random() * (max - min) + min;
    }
    var $arrow = '<line xmlns="http://www.w3.org/2000/svg" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" marker-end="url(#arrowhead-end-width1)" class="links" style="stroke-width: '+getRandomArbitary(0.4, 3)+';"/>'
    //var $arrow = $("<div class='arrow' style='z-index:-1;padding:0px; margin:0px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);'><div class='line'></div><div class='point right' style='right: "+(($c1.width()/2))+"px'></div></div>");
        
    // prepend otherwise it hovers the circles
    $('svg').prepend($arrow);
}


$(function() {

var N3Util = N3.Util;
parseTextarea();
function parseTextarea() {
    var parser = N3.Parser();
    var word_array = [];

    var all = {};
    var datasets = [];
    var linksets = [];
    parser.parse($('textarea').val(), function (error, triple, prefixes) {
        if(error)
            console.log(error)
        if(!triple) {
            parseAll(all, datasets, linksets);
            return;
        }
        all[triple.subject] = all[triple.subject] || {};
        if(all[triple.subject][triple.predicate]) { // make it an array with this inside
            if(!$.isArray(all[triple.subject][triple.predicate])) {
                all[triple.subject][triple.predicate] = [all[triple.subject][triple.predicate]];
            }
            all[triple.subject][triple.predicate].push(triple.object);

        } else {
            all[triple.subject][triple.predicate] = triple.object;
        }

        if(triple.object == 'http://rdfs.org/ns/void#Dataset') {
            datasets.push(triple.subject);
        } else if(triple.object == 'http://rdfs.org/ns/void#Linkset') {
            linksets.push(triple.subject);
        }
    });
}

function parseAll(all, datasets, linksets) {
    var word_array = [];
    var subsets = {}; // record subsets for after
    for(var i=0, len = datasets.length; i < len; i++) {
        var word = {};

        word.uri = datasets[i];
        // get rest from all
        var obj = all[datasets[i]];
        
        word.text = obj['http://purl.org/dc/terms/title'];
        if(!word.text) {
            word.text = word.uri;
        }
        if(N3Util.isLiteral(word.text)) {
            word.text = N3Util.getLiteralValue(word.text);
        }

        var numTriples = obj['http://rdfs.org/ns/void#triples'];
        if(N3Util.isLiteral(obj['http://rdfs.org/ns/void#triples'])) {
            numTriples = N3Util.getLiteralValue(obj['http://rdfs.org/ns/void#triples']);
        }
        word.weight = numTriples || Math.random();

        // record void:subset
        if(obj['http://rdfs.org/ns/void#subset']) {
            subsets[datasets[i]] = obj['http://rdfs.org/ns/void#subset'];
        }

        word_array.push(word);
    }
    $("svg").jQCloud(word_array, {
        afterCloudRender: function() {
            // adjust text!
            /*
            $('.inner, .circle').each(function() {
                var $this = $(this);
                var $parent = $this.parent();
                $this.css({
                    top: ($parent.height() / 2) - ($this.height() / 2),
                    left: ($parent.width() / 2) - ($this.width() / 2)
                });
            });
            */
            // connect!
            // do linkset
            for(var i=0, len = linksets.length; i < len; i++) {
                var obj = all[linksets[i]];
                if(obj['http://rdfs.org/ns/void#target']) {
                    subject = obj['http://rdfs.org/ns/void#target'][0];
                    object = obj['http://rdfs.org/ns/void#target'][1];
                } else if(obj['http://rdfs.org/ns/void#objectsTarget']) {
                    subject = obj['http://rdfs.org/ns/void#subjectsTarget']
                    object = obj['http://rdfs.org/ns/void#objectsTarget'];
                }
                var subjectCircle = $('[uri="'+subject+'"]');
                var objectCircle = $('[uri="'+object+'"]');
                if(subjectCircle.length && objectCircle.length) {
                    connect(subjectCircle, objectCircle, '#0f0', 5);
                }
            }
            // do void:subset
            for(var x in subsets) {
                var val = subsets[x];
                if($.isArray(val)) {
                    $.each(val, function(idx, value) {
                        // only do Datasets
                        var o = all[value]
                        if(!o) return;
                        var type = o['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'];
                        if(
                            (type == 'http://rdfs.org/ns/void#Dataset')
                            ||
                            ($.inArray('http://rdfs.org/ns/void#Dataset', type) > -1)
                        ) {
                            var subjectCircle = $('[uri="'+x+'"]');
                            var objectCircle = $('[uri="'+value+'"]');
                            if(subjectCircle.length && objectCircle.length) {
                                connect(subjectCircle, objectCircle, '#0f0', 5);
                            }
                        }
                    })
                } else { // only a single subset
                    var subjectCircle = $('[uri="'+x+'"]');
                    var objectCircle = $('[uri="'+val+'"]');
                    if(subjectCircle.length && objectCircle.length) {
                        connect(subjectCircle, objectCircle, '#0f0', 5);
                    }
                }

            }

            $("#cont").html($("#cont").html());

            // do text
            // after we drew it
            $('svg text').each(function() {
                var $this = $(this);
                var $circle = $this.parent().find('circle');
                var circleWidth = $circle.attr('r') * 2;

                var words = $this.text().split(' ')

                // try first word
                var elems = [$this];
                tryWord($this, circleWidth, words, 0, elems)

                // align them now
                var fullHeight = 0;
                for(var i=0; i<elems.length; i++) {
                    var $elem = elems[i];
                    var bbox = $elem.get(0).getBBox();
                    var width = bbox.width;
                    var height = bbox.height;
                    fullHeight += height;

                    $elem.attr('y', parseFloat($circle.attr('cy'), 10) + (fullHeight));

                    /*
                    var diff = $elems.attr('y') - $circle.attr('cy');
                    */
                }
                for(var i=0; i<elems.length; i++) {
                    var $elem = elems[i];
                    $elem.attr('y', parseFloat($elem.attr('y'), 10) - ( (fullHeight  )/ 2));

                }

            });
            function tryWord($textElem, circleWidth, words, idx, elems) {
                if(!words[idx]) { 
                    return;
                }
                if($textElem.text() == '' || idx == 0) {
                    $textElem.text(words[idx])
                } else {
                    var cpy = $textElem.text();
                    $textElem.text($textElem.text() + ' ' + words[idx])
                }

                // re-read values
                var bbox = $textElem.get(0).getBBox();//textElem.getBBox();
                var width = bbox.width;
                var height = bbox.height;

                if(width > circleWidth) {
                    if(idx == 0) { // even first word is longer
                        // trim it
                        $textElem.text(words[idx].substr(0, 10))
                    } else{
                        // create a new <text>
                        var $newText = $textElem.clone();
                        elems.push($newText);
                        $newText.insertAfter($textElem);
                        // set it how it was before since we just used the word to measure
                        $textElem.text(cpy);

                        $newText.text(words[idx]); // set it
                        //$newText.attr('y', parseFloat($newText.attr('y'),10) + circleWidth);
                        return tryWord($newText, circleWidth, words, idx + 1, elems);
                    }

                }

                tryWord($textElem,circleWidth, words, idx + 1, elems);
            }
        }
    });
}


$('button.parse').click(function() {
    $('.arrow').remove();
    var style = $('svg style').clone();
    var defs = $('svg defs').clone();
    $('svg').html('');
    $('svg').append(style).append(defs);
    parseTextarea();    
});
$('button.save').click(function() {
    open("data:image/svg+xml," + encodeURIComponent($('svg').get(0).outerHTML));
});
});

function positionCircle(circle) {
    // random size
    // each bubble size of
    /*
    var totalWidth = 0;
    var min = 70;
    var max = 160;
    // and the formula is:
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    circle.css({
        width: max,
        height: max
    });
    */

    // adjust inner text
    var fontSize = 14;
    var $inner = circle.find('.inner');
    var innerHeight = $inner.height();
    var innerWidth = $inner.width();
    if(innerWidth > circle.width()) {
        fontSize = 10;
    }
    $inner.css({
        top: (circle.height() / 2) - ($inner.height() / 2),
        left: (circle.width() / 2) - ($inner.width() / 2)
    });


    // put circle randomly in position
    /*
    var rand_x=0;
    var rand_y=0;
    var area;
    do {
        rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
        rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
        area = {x: rand_x, y: rand_y, width: circle.width(), height: circle.height()};
    } while(check_overlap(area));

    filled_areas.push(area);

    circle.css({
        left:rand_x, 
        top: rand_y
    });
    */

}

