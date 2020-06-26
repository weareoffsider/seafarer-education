Parallel Sailing
====================

Parallel Sailing is the least complicated passage to calculate, travelling West or East and staying on the same line of Latitude the entire time. Because of this, all you need to calculate is:

- the Difference in Longitude (degrees, direction, and minutes)
- the Departure (nautical miles covered)

Example Question: A to B
--------------------------

You are sailing from position A: :math:`35° 42.7' N :: 120° 32.7' E` to position B: :math:`35° 42.7' N :: 150° 35.4' E`. Calculate the course and distance covered between these two points.

We can see the Latitude is the same at both points, so this is a Parallel Sailing Question. Find the D'Lon:

.. math::
    Dest'Lon &= E 150° 35.4' \\
    Dest'Lon &= + 150° 35.4' \\
    Origin'Lon &= E 120° 32.7' \\
    Origin'Lon &= + 120° 32.7' \\
    D'Lon &= Dest'Lon - Origin'Lon \\
    D'Lon &= + 30° 02.7' \\
    D'Lon &= E 30° 02.7'

Because the D'Lon is positive and Easterly, the course to steer will be East, or :math:`090° T`. All that's left is to find out the distance travelled, which we can do with the D'Lon in minutes, and our Departure Formula using the Latitude:

.. math::
    D'Lon_{min} &= D'Lon * 60 \\
    D'Lon_{min} &= 1802.7' \\
    Lat &= N 35° 42.7' \\
    Lat &= + 35° 42.7' \\
    Departure_{nm} &= D'Lon_{min} * Cos Lat \\
    Departure_{nm} &= 1463.728744

With that, we find that the distance between the points is 1,463.728744 nautical miles.

Question Generator: A to B
--------------------------

.. raw:: html

    <div class="ParallelSailing">
    </div>

Once you're happy working out the D'Lon and Departure for Parallel Sailing, it's time to move on to :doc:`./plane_sailing`.
