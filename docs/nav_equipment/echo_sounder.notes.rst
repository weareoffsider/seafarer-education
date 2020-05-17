Echo Sounder
=================

Knowing the depth of water is essential for safe navigation. They let you know the actual state of the depth underneath you, not just the charted depth, and allow for position verification.


Performance Standards and Requirements
--------------------------------------
Governed by SOLAS Chapter V, and are effected in MO-21.


All ocean going passenger and trading vessels greater than 300 GT must carry an echo sounder, although vessels smaller than that will regularly carry echo sounders too.

Depth sounders must work to a certain standard to be certified:

- They must function at this minimum standard from 0 to 30 knots.

- Calibrated to a sound speed of 1500 metres per second.

- Operate clearances between 2m and 200m.

- Range Scales - at a minimum must have 20m and 200m range scale.

- Minimum 15 minutes of soundings on the display.

- PRF should not be slower than:

  * 12 pulses per minute
  * 36 pulses per minute

- Must function at this baseline in roll up to 10 degrees, and pitch up to 5 degrees.

Accuracy Standard
^^^^^^^^^^^^^^^^^

Allow for this degree of inaccuracy: always use the greater of the two.

For shallow waters.

.. math::
    \pm 0.5 \text{ metres} \lesseqgtr \pm 25\% \text{ of indicated depth}


For deep waters.

.. math::
    \pm 5 \text{ metres} \lesseqgtr \pm 25\% \text{ of indicated depth}


Fundamental Theory
------------------

Sound travels through the water as waves. Short pulse, better discrimination & resolution. Long pulse, better range through more power. Pulse Repetition Frequency is how many pulses go out per minute. This is constrained by the depth of water, as sound always travels the same speed (1500 metres per second calibrated) so we need to not be transmitting faster than the time it takes for our echos to return.

Attenuation
^^^^^^^^^^^^
Loss of power as it travels. Frequency proportional, high frequencies attenuate faster. Deep sounders must use low frequencies.

Salinity affects attenuation, salt water speeds up the signal although it's low enough of an affect that it need not be accounted for.

Reflective surfaces (or absorbent surfaces) affect strength of the return signal. Typically at the ranges and powers used this should be overcome even on muddy bottoms.


Velocity
^^^^^^^^^

1505 metres per second at 15°C at atmospheric pressure in normal salinity. Calibrated to 1500m/s.

Noise
^^^^^^^
Sets can be overwhelmed in interference, either from the set's transmissions, or unwanted noise around the transducer.



Echo Ranging
--------------

Transmit and receive acoustic energy through the water, which is reflected off the bottom and returns to the transducer. The time taken allows the echo sounder to calculate the depth:

.. math::
    Depth (metres) = \text{Velocity(metres per second)} * Time(seconds) \div 2

Sets are calibrated to 1500 metres per second, so:

.. math::
    Depth = 1500 * Time(seconds) \div 2

Transducers send and receive acoustic energy.


Angle of Travel
^^^^^^^^^^^^^^^^
Affects accuracy if return signal travels longer than expected distances. Also 90 degree angles are better for the return signal.



Types
-------------

Magnetostrictive - robust and protected by a solid transmitting face. Ideal for deep sea sounders.
Annealed Nickel wrapped in copper - current causes expansion and contraction creating vibration.

Electrostrictive - less robust, higher frequency and resolution. Super yachts or other vessels interested in bottom resolution.

Piezoelectric - Simple, cheap, smaller vessels.


Operation
----------

**Gain**
    Adjusts sensitivity to echos, adjusted to ensure you don't miss details, but are also not overwhelmed. Only affects the receiver, not the transmitter.

**Range and Phase**
    Selects appropriate range scale. This affects the PRF (due to the need to slow the sounder down for deeper depths). This affects discrimination, so the appropriate scale for the conditions must be used.

**White Line**
    An interpretation setting on the receiver that makes it easier for operators to see the actual bottom.

**Time Varied Gain**
    Unlike Gain which applies at all depths, TVG is used to supress closer echoes while retaining deeper echoes.

**UKC vs Depth**
    Depth Sounders may have operational capacity to display the depth RATHER than the Under Keel Clearance (based on the siting of the sounder). It is essential to know what the set displays, ideally UKC is best as that way the point of grounding is 0 metres on the sounder, rather than your draft.


Errors
----------

**Double Echoes** - propagations that hit bottom, ship, bottom then ship, measuring at twice actual depth.

**Multiple Echoes** - sometimes due to sensitivity (reduce gain)

**Interference**


Checks
----------

Hand Lead Line

Bar Check (sounding target lowered in to water to a known depth)


Care
------
Clean transducer face when possible.











