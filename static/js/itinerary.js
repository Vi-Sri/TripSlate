
(function ($) {
    "use strict";
   var iti = [
                [
                     "9:00",
                     "9:20",
                     39.947701,
                    -75.1703127,
                    "Monk’s Cafe",
                    "restaurant",
                     75,
                    94,
                    "Partly sunny w/ t-storms"
                ],
                [
                    "10:10",
                     "11:10",
                     39.962057,
                    -75.1521697,
                    "Edgar Allan Pоe National Historic Site",
                    "museum",
                    75,
                    94,
                    "Partly sunny w/ t-storms"
                ],
                [
                    "11:30",
                    "12:30",
                    39.9522182,
                    -75.1468284,
                    "Betsy Ross House",
                    "interest",
                    75,
                    94,
                    "Partly sunny w/ t-storms"
                ],
                [
                    "15:30",
                    "16:30",
                     39.949053,
                    -75.149927,
                    "Independence Hall",
                    "history",
                    75,
                    94,
                    "Partly sunny w/ t-storms"
                ],
                [
                    "18:30",
                    "19:30",
                    40.7187998,
                    -73.9922584,
                    "Tenement Museum",
                    "museum",
                    75,
                    94,
                    "Partly sunny w/ t-storms"
                ],
                [
                    "19:30",
                    "20:30",
                    40.7211166,
                    -73.9900256,
                    "Russ & Daughters Cafe",
                    "restaurant",
                    75,
                    94,
                    "Partly sunny w/ t-storms"
                ]
        ]
    console.log(iti);
    populateTable();
    $('#viewMap').on('click', function(){
        var url = generateRoute()
        console.log(url)
        window.open(url, "_blank");
    })

    function generateRoute() {
        var base_url = "https://www.google.com/maps/dir/"
        $.each(iti, function(i,ele) {
        base_url += ele[2] + "," + ele[3] + "/"
        });
        return base_url
    }

    function populateTable() {
        var newRows;
        $.each(iti, function(i,ele) {
                newRows += "<tr><td>" + ele[0] + "</td><td>" + ele[1] + "</td><td>" + ele[4] + "</td><td>" + ele[5] + "</td><td>" + ele[6] + "</td><td>" +
                        + ele[7] + "</td>" + "<td>" + ele[8] + "</td>" +"</tr>";
            });
        $("table tr:first").after(newRows);
    }

})(jQuery);