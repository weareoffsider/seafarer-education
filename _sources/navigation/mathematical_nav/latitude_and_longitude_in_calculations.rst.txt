Latitude and Longitude in Calculations
=========================================

Working with Latitude and Longitude positions is a constant part of mathematical navigation. You need to work out the difference between two positions, and the direction of travel (N/E/W/S). You can greatly simplify this process if you adopt the following convention when using a calculator:

Latitude Math
----------------

Any Northern Latitude is positive, and any Southern Latitude is negative, ie:

.. math::
    30° S &= -30° \\
    30° N &= 30° \\
    50° 23.5' S &= -50° 23.5' \\
    35° 42.7' N &= 35° 42.7'

Difference in Latitude
^^^^^^^^^^^^^^^^^^^^^^^

This convention becomes very useful when we want to figure out the difference in Latitude. Subtracting numbers can actually be used to compare them, and in the case of Latitudes we can use that fact to compare two latitudes as long as we remember to subtract the origin from the destination. For example:

.. math::
    D'Lat = 30°N \longleftarrow 60°S = 30° - -60° = 90° = 90° N \\
    D'Lat = 30°S \longleftarrow 60°S = -30° - -60° = 30° = 30° N \\
    D'Lat = 60°S \longleftarrow 30°S = -60° - -30° = -30° = 30° S

Obviously in simple cases like this it's easy enough to do the difference in your head, but remembering this rule will mean you can get it right every time with your calculator to any number of degrees, minutes and decimal places. The sign of Difference in Latitude matters, as it indicates which direction of travel is occuring, which is used for finding the final course.

Difference in Latitude in Minutes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

D'Lat is the common name for difference in Latitude. Often we need to use the D'Lat in minutes rather than degrees, which you can get on your calculator just by multiplying by 60.

.. math::
    D'Lat &= 10° N \\
    D'Lat_{min} &= 10° * 60 \\
    D'Lat_{min} &= 600'

When you use the D'Lat in minutes, you're usually interested in the distance in nautical miles, so just remove the minus sign if the D'Lat is south:

.. math::
    D'Lat &= 20° S \\
    D'Lat_{min} &= -20° * 60 \\
    D'Lat_{min} &= 1200'



Longitude Math
--------------

Any Eastern Longitude is positive, and any Western Longitude is negative, ie:

.. math::
    30° W &= -30° \\
    30° E &= 30° \\
    50° 23.5' W &= -50° 23.5' \\
    35° 42.7' E &= 35° 42.7'

Difference in Longitude
^^^^^^^^^^^^^^^^^^^^^^^

Working out difference in Longitude works the same way, subtracting the origin from the destination.

.. math::
    D'Lon = 30°E \longleftarrow 60°W = 30° - -60° = 90° = 90° E \\
    D'Lon = 30°W \longleftarrow 60°W = -30° - -60° = 30° = 30° E \\
    D'Lon = 60°W \longleftarrow 30°W = -60° - -30° = -30° = 30° W

Where longitude differs from latitude is in situations where the shortest distance means travelling through the anti-meridian, for example:

.. math::
    D'Lon = 160°E \longleftarrow 170°W = 160° - -170° = 330° = 330° E

So this isn't right, we're taking the long way around, going 330° around the world rather than 30° in the other direction. We can correct this just by adding or subtracing 360° whenever the result is greater than 180° or less than -180°, so:

.. math::
    D'Lon = 330° - 360° = -30° = 30°W \\
    D'Lon = -190° + 360° = 170° = 170°E

Difference in Longitude in Minutes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Converting Difference in Longitude to minutes works the same way as Latitude, just multiply by 60 to get the value in minutes.

.. math::
    D'Lon &= 10° E \\
    D'Lon_{min} &= 10° * 60 \\
    D'Lon_{min} &= 600'

It's important to note that Longitude in Minutes DOES NOT correlate with nautical miles, as meridians get closer together the closer they are to the poles, see :doc:`../fundamentals` for more on this.

Departure
---------------------

**Departure** is the conversion of a Difference in Longitude (in minutes) to nautical miles. In order to do this we need to know the Latitude at which we are calculating the departure, because the meridians get closer together as you get closer to the poles.

At 0° of latitude a minute of longitude is equivalent to a nautical mile.
At 90° of latitude a minute of longitude is no distance at all, because that's at the north or south pole.

Treating the Earth as a perfect sphere, we can get a reasonably accurate ratio by using the :math:`\cos()` function of our calculator.

.. math::
    \cos 0° &= 1 \\
    \cos 90° &= 0 \\
    \cos 45° &= 0.707106781

:math:`\cos()` works with negative angles too, so our convention of using negative Southern Latitudes still works:

.. math::
    \cos -90° &= 0 \\
    \cos -45° &= 0.707106781

All we need to do from here is to multiply the Difference in Longitude (in Minutes) by the ratio and we have our Departure.

.. math::
    D'Lon_{min} &= 600' \\
    Lat &= 20°N = 20° \\
    Departure_{nm} &= D'Lon_{min} * \cos Lat \\
    Departure_{nm} &= 600' * \cos 20° \\
    Departure_{nm} &= 563.8155725 \text{ nautical miles}

With Departure in hand, we can move on to our first sailing, :doc:`./parallel_sailing`.




