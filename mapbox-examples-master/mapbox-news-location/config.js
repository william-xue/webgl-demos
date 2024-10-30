var config = {
    // style: 'mapbox://styles/sportmapz/ck5rzrbjc39al1ip8vzfq62yp',
    // accessToken: 'pk.eyJ1Ijoic3BvcnRtYXB6IiwiYSI6ImNqeHAyeGlzMDBic2UzYnBmcGY3aTVybXgifQ.oJjEJBpsnuVfD1R32KHISA',
    style: 'mapbox://styles/pinganshan/ckycrvm6n6z9j16k9xkknyc3i',
    accessToken: 'pk.eyJ1IjoicGluZ2Fuc2hhbiIsImEiOiJja2x3M2ZkcHkweXBpMndwOWZ4ZjQ1NTFoIn0.vDeeNsG4fOoX6M8HT5mLCA',
    showMarkers: true,
    theme: 'light',
    alignment: 'right',
    title: 'MAP数据',
    subtitle: '子标题',
    byline: "",
    others: "",
    chapters: [
        {
            id: 'St. Le Voyageur',
            title: 'St. Le Voyageur, Whale Town',
            name : 'St. Le Voyageur',
            address : 'Whale Town',
            othersName: 'Elon Estate',
            image: 'images/1.png',
            description: `Human Orders and Chaos The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [33.384396, 66.270904],
                zoom: 6,
                pitch: 0.00,
                bearing: 0.00,
                essential: true,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    opacity: 1
                }
            ]
        },
        {
            id: 'Consensus Square',
            title: 'Consensus Square, Consensus Square',
            name : 'Consensus Square',
            address : 'Consensus Square',
            othersName: 'Ultra Harbour',
            image: 'images/2.png',
            description: `Human Orders and Chaos
            The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [-85.711703, 38.271424],
                zoom: 6,
                pitch: 6,
                bearing: 0,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    opacity: 1
                }
            ]
        },
        {
            id: 'The Hit Studio',
            title: 'The Hit Studio, BTC Tower',
            name : 'The Hit Studio',
            address : 'BTC Tower',
            othersName: 'Game Area',
            image: 'images/3.png',
            description: `Human Orders and Chaos
            The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [-2.989151, 54.88299],
                zoom: 6,
                pitch: 50,
                bearing: 0,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 0
                }
            ],
            onChapterExit: [
                {
                    opacity: 0
                }
            ]
        },
        {
            id: 'Casino Royale',
            title: 'Casino Royale，Chesnut Hill',
            name : 'Casino Royale',
            address : 'Chesnut Hill',
            othersName: 'Cloud Storage Park',

            image: 'images/4.png',
            description: `Human Orders and Chaos
            The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [-77.285957, 21.231365],
                zoom: 6,
                pitch: 0,
                bearing: 0,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 0
                }
            ],
            onChapterExit: [
                {
                    opacity: 0
                }
            ]
        },
        {
            id: 'N-link Showroom',
            title: 'N-link Showroom -ArtArea',
            name : 'N-link Showroom',
            address : 'Art Area',
            othersName: 'Municipal Center',
            image: 'images/5.png',
            description: `Human Orders and Chaos
            The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [11.262763, 43.750695],
                zoom: 6,
                pitch: 50,
                bearing: 0,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 0
                }
            ],
            onChapterExit: [
                {
                    opacity: 0
                }
            ]
        },
        {
            id: 'Space H Lauchpad',
            title: 'Space H Lauchpad - NASA',
            name : 'Space H Lauchpad',
            address : 'NASA',
            othersName: 'Art Area',

            image: 'images/6.png',
            description: `Human Orders and Chaos
            The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [-15.147667, 81.399991],
                zoom: 6,
                pitch: 50,
                bearing: 0,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    opacity: 1
                }
            ]
        },
        {
            id: "Hit'it Bar",
            title: "Hit'it BarElon Habour",
            name : "Hit'it Bar",
            address : 'Elon Habour',
            othersName: 'Whale Town',

            image: 'images/7.png',
            description: `Human Orders and Chaos
            The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [44.011147, -65.642496],
                zoom: 6,
                pitch: 50,
                bearing: 0,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    opacity: 1
                }
            ]
        },
        {
            id: 'Elon Habour',
            title: 'Elon Habour，Elon Habour',
            name : 'Elon Habour',
            address : 'Elon Habour',
            othersName: 'Wall Street',

            image: 'images/8.png',
            description: `Human Orders and Chaos
            The fundamental treatise of human civilization is Norbert Elias's The Civilizing Process (1939), which traces social mores from medieval courtly society to the Early Modern period.  Gordon Childe defined the emergence of civilization as the result of two successive revolutions: the Neolithic Revolution, triggering thedevelopment of settled communities, and the Urban Revolution.`,
            location: {
                center: [-69.468391, 60.896784],
                zoom: 6,
                pitch: 0.00,
                bearing: 0.00,
                animate: true,
                easing: function (t) {
                    const n1 = 7.5625;
                    const d1 = 2.75;

                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            },
            onChapterEnter: [
                {
                    opacity: 1
                }
            ],
            onChapterExit: [
                {
                    opacity: 1
                }
            ]
        }
    ]
};
