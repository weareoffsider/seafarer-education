RADAR
=================

RADAR stands for Radio Detection And Ranging. You probably have an idea of what it does but lets go in to the fundamentals of how it works.

Fundamental Concepts
-----------------------

RADARs transmit radio waves out in to the world. When those radio waves make contact with a target, they will reflect. Provided the surface does not absorb too much energy, and some of the waves reflect directly back towards the transmitter, a receiver in the RADAR can measure the strength of the radio waves that return. This all happens extremely quickly because radio waves travel at the speed of light, which is 300,000,000 metres per second. That's a big number, so for practicality it makes sense to work in microseconds instead, in which case it's 300 metres per microsecond.

Range
^^^^^

It's important to know that speed, because it's pivotal to how RADARs work out the range of an 'echo'. With a sufficiently accurate time measurement function and a receiver, you can measure how many microseconds it took for an echo to return to the RADAR, and in doing so calculate the range of that echo (pg. 2) [DNBW05]_.

.. math::
    Range_{metres} = Time_{microseconds} \div 300 \div 2

We divide the time by the speed of light, and then divide by 2 because the radio wave had to travel to the target and back.

Bearings
^^^^^^^^^^

The bearing of an echo is found based on the direction the scanner was pointing at the time of transmission. This will be taken relative to the ship, with no sense of compass direction. If the ship links an accurate source of direction to the RADAR system, typically a Gyroscopic Compass, then the bearings will be able to be provided as relative to the ship or as a True bearing (provided the Compass has no error).

Care should be taken with bearings however as they are never as accurate as range due to the fact that radio waves while concentrated in RADAR setup, are not accurate down to a degree. The width of the RADAR beam transmitted matters because everything within that beam will be received. This angle is called Horizontal Beamwidth and for RADARs complying with IMO Performance Standards [IMONav]_ it must be below 2.5°.






.. [DNBW05]
    W. Dinely, A. Norris, A. Bole, and A. Wall. 2005. Radar and ARPA Manual: Radar and Target Tracking for Professional Mariners, Yachtsmen and Users of Marine Radar. Elsevier Science & Technology.

.. [IMONav]
    Annex 9 - IMO Performance Standards for Navigational Equipment - http://solasv.mcga.gov.uk/annexes/Annex09.htm
