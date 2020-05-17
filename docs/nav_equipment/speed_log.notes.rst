Speed Log
===========

Speed Through Water and Speed over Ground Measurement.

All vessels 300GT and above must have Speed Through Water.
All vessels 50,000GT and above must all have athwartships speed, and Speed over Ground.


Performance Standards
----------------------

SOG - Must be accurate up to the maximum speed of the ship, in greater than 2m water beneath the keel.

STW - Must be accurate up to the maximum speed of the ship, in greater than 3m water beneath the keel.

0.1 knot accuracy in digital display, 0.5 knot graduations in analog with 5 knot graduations.

Accuracy Standards
------------------

Assume an error of whichever is greatest, for digital displays:

.. math::
    \pm 0.2 \text{ knots} \lesseqgtr \pm 2\% \text{ ship speed}

For analog displays:

.. math::
    \pm 0.25 \text{ knots} \lesseqgtr \pm 2.5\% \text{ ship speed}



Log Types
------------

**Electromagnetic Log**
    Measures fluid movement past an electronic sensor. Sensitive to cavitation. Generally stable and free from fouling. Can only do Speed Through Water.

**Doppler Log**
    Uses acoustic energy, but measures the frequency shift of the return signal, rather than the timing. Measure the frequency shift to get the speed. Higher frequency received means moving forward. Lower frequency means ship moving astern.

    Janus Configuration used to reduce error with two logs. Then another two transducers pointing port and starboard can record transverse movement.

    Can detect sound energy reflections from a water layer (water lock) or a ground layer (bottom lock).



SMIDS
-----

GPSS/GNSS systems are NOT logs, even though they can provide quite accurate turning information. They are entirely dependant on outside data provided by a satellite constellation so they are not an independant source of data, but nonetheless the maritime world assumes their presence these days.


