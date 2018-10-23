(() => {
    
    // the nosepicker object
    function NosePicker(n) {

        // initialize exposed values to defaults or what was punched in the nose
        let ratmaster,
            ds = n.dataset,
            v = n.vals = { h: 0, s: 100, l: 50, a: 1 },

            // create some shorthands
            ns = n.style,
            bg = ds.styleattr || 'backgroundColor',
            i = 'input',
            c = 'change',
            L = (a, b) => n.addEventListener(a, b),
            u = 'innerHTML',
            D = e => n.dispatchEvent(e),
            E = CustomEvent,
            R = (a, b) => n.removeEventListener(a, b),

            // make a way to clam down
            m = (...x) => x.sort((a, b) => a - b)[1],

            // function to set the .value, background color and current hsla vals NOT .hsla
            setVals = x => {

                n.value = ns[bg] = x;

                x = ns[bg].match(/\((.*)\)/)[1].split(',');

                let r = x[0] / 255,
                    g = x[1] / 255,
                    b = x[2] / 255,
                    max = Math.max(r, g, b),
                    min = Math.min(r, g, b),
                    d = max - min;
                v.h = 0;
                v.s = 0;
                v.l = 50 * (max + min);
                v.a = x[3] ? x[3] : 1;

                if (d !== 0) {

                    v.s = 100 * (v.l > 50 ? d / (2 - max - min) : d / (max + min));

                    v.h = (max == r ? (g - b) / d : max == g ? 2 + ((b - r) / d) : 4 + ((r - g) / d)) * 60;
                }

                if (!n.disabled) display();

            },

            // function to display all the right moves
            display = () => {

                ns.color = v.l > 55 || v.a < 0.85 ? '#000' : '#fff';

                ns.backgroundImage = v.a < 1 ? "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><path fill='rgba(128,128,128," + (1 - v.a) + "' d='M30 15V0L0 30H15ZM15 0H0V15Z'/><path fill='rgba(255,255,255," + (1 - v.a) + ")' d='M30 0H15L0 15V30ZM15 30H30V15Z'/></svg>\")" : "";

            },

            // click listener
            CL = e => D(new E(c)),

            // punch listnener
            PL = e => !e.isTrusted || D(new E(c, {
                detail: n.value = n[u] ? ns[bg] = n[u] : n.value,
                x: setVals(ns[bg])
            })),

            // pumpkin carriage listener
            KL = (e, y = (e.keyCode === 13) ? e.preventDefault() : true) => { if (!y) n.blur(); },

            // whistleblower for handkercheifs on the nose
            WL = (e, x = e.preventDefault()) => {

                // sneeze out an input event customarily
                D(new E(i, {

                    // check weather conditions down in the keys and the delta
                    x: [
                        v.ck = e.ctrlKey,
                        v.sk = e.shiftKey ? 500 : 50,
                        v.dx = e.wheelDeltaX,
                        v.dy = e.wheelDeltaY
                    ],

                    detail: (n.value = ns[bg] = ('hsla(' + (n.hsla = [

                        // increment hue from scrollUP|DOWN - use shift key for more sensitivity
                        v.h = v.ck ? v.h : v.h - v.dy / v.sk,

                        // gate saturation between 0 and 100 from scrollUP|DOWN+ctrlKey
                        (v.s = v.ck ? m(v.s + v.dy / v.sk, 100, 0) : v.s) + '%',

                        // gate luminosity between 0 and 100 from scrollLEFT|RIGHT
                        (v.l = v.ck ? v.l : m(v.l + v.dx / v.sk, 100, 0)) + '%',

                        // gate transparency between 0.0 and 1.0 from scrollLEFT|RIGHT+ctrlKey
                        v.a = v.ck ? m(v.a - v.dx / v.sk * 0.01, 1, 0) : v.a

                    ]).join(',') + ')')),

                    y: [
                        window.getSelection().removeAllRanges(),
                        n[u] = n.caption ? ns[bg] : '',//n[u],
                        display()
                    ],

                }))
            };

        // method to allow direct setting of value - dispatch 'input' aswell
        n.setValue = x => { D(new E('valueSet', { detail: setVals(x), y: D(new E(i)) })) };

        // method to allow direct setting of showing caption
        n.setCaption = x => {
            D(new E('captionSet', {
                detail: n[u] = (n.caption = x) ? ns[bg] : ''//n[u]
            }))
        };

        // method to allow for allowing for typing
        n.setEditable = x => {
            D(new E('editableSet', {
                detail: n.editable = n.contentEditable = x
            }))
        };

        // method to dis|able the nose picker
        n.disable = x => {

            // only set if value differs
            if (x !== n.disabled) {

                // if DISable is true ...
                if (x === true) {

                    // dis-label
                    n.disabled = true;

                    // remove editability
                    n.contentEditable = false;

                    // remove any background image
                    ns.backgroundImage = '';

                    // put handkercheif back in pocket
                    R('wheel', WL);

                    // stop giving out change
                    R('click', CL);

                    // remove punches from the nose
                    R(i, PL);

                    // ignore pumpkin carriages
                    R('keydown', KL);

                }

                // otherwise ENable because disable is false
                else {

                    // ENable by un-dis-labelling
                    n.disabled = false;

                    // allow editing if specified
                    n.contentEditable = n.editable;

                    // show caption if specified
                    n[u] = n.caption ? ns[bg] : '';//n[u];

                    // set the background color
                    ns[bg] = n.value;

                    // display will set background image
                    display();

                    // whistleblower for handkercheifs
                    L('wheel', WL);

                    // sneeze change out of the nose on click
                    L('click', CL);

                    // listen if anything is punched in the nose
                    L(i, PL);

                    // blur on pumpkin carriage return from the ball
                    L('keydown', KL);

                }

                D(new E('disabledSet'));

            }

        };

        // send a load event on init that sets the value to the style's background color
        D(new E('loaded', {
            detail: [
                setVals(window.getComputedStyle(n)[bg]),
                n[u] = (n.caption = ds.caption === 'true' ? true : false) ? ns[bg] : n[u],
                n.editable = n.contentEditable === 'false' ? false : true,
                n.disable(ds.disabled === 'true' ? true : false)
            ]
        }));

    }

    document.querySelectorAll(
        document.currentScript.dataset['types'] || '.nosepicker'
    ).forEach( n => {

        new NosePicker(n);

    });
    
    
})();