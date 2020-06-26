Plane Sailing
====================

Plane Sailing is so called because we pretend the Earth is flat for the purpose of the calculation. Because of this, Plane Sailing is only accurate enough for distances under 500 nautical miles. It is necessary to have an understanding of the trigonometry rules for Right Angle Triangles (https://courses.lumenlearning.com/boundless-algebra/chapter/trigonometry-and-right-triangles/), so brush up on that if you're not familiar before carrying on.

The Concept
---------------
We construct a right angled triangle using the D'Lon in minutes, and the Departure. In order to calculate the Departure we need a Latitude, so we use the mean (average) of the Origin and Destination Latitude, referred to as M'Lat. Our Right Angle triangle ends up looking like this, we always draw a line South or North from the Origin first, and then go East or West to the Destination.

.. image:: plane_sailing_1.svg

In order to solve the triangle and get our distance we follow these steps:

1. Calculate the Difference in Latitude and Longitude (D'Lon and D'Lat) between the two points.
2. Calculate the Mean latitude (M'Lat) between the two latitudes.
3. Calculate the Departure using :math:`D'Lon_{min} * cos M'Lat`.
4. Using the tangent right triangle rule, calculate the Course Angle: :math:`\tan^{-1 }(Departure_{nm} \div D'Lon_{min})`.
5. Using the cosine right triangle rule, calculate the Distance: :math:`D'Lat_{min} \div \cos \text{Course Angle}`

Example Question: A to B
--------------------------

You are sailing from position A: :math:`15° 37' S :: 174° 14' E` to position B: :math:`17° 18' S :: 176° 25' E`. Calculate the course and distance covered between these two points.

D'Lon and D'Lat
^^^^^^^^^^^^^^^^
Get the D'Lon and D'Lat between the two points:

.. math::
    D'Lat &= Dest'Lat - Origin'Lat \\
    D'Lat &= (-) 17° 18' - (-) 15° 37' \\
    D'Lon &= Dest'Lon - Origin'Lon \\
    D'Lon &= (+) 176° 25' - (+) 174° 14' \\
    \\
    D'Lat &= (-) 1° 41' = S 1° 41' \\
    D'Lat_{min} &= 101.00'
    D'Lon &= (+) 2° 11' = E 2° 11' \\
    D'Lon_{min} &= 131.00'

Mean Latitude
^^^^^^^^^^^^^^^^
Get the M'Lat by averaging the latitudes:

.. math::
    M'Lat &= (Dest'Lat + Origin'Lat) \div 2 \\
    M'Lat &= ((-) 17° 18' + (-) 15° 37') \div 2 \\
    \\
    M'Lat &= (-) 16° 27.5' = S 16° 27.5'

Departure
^^^^^^^^^^^^^^^^^
Get the Departure in nautical miles:

.. math::
    Departure_{nm} &= D'Lon_{min} * \cos M'Lat \\
    Departure_{nm} &= 131.00 * \cos((-) 16°27.5') \\
    \\
    Departure_{nm} &= 125.632409

Course Angle
^^^^^^^^^^^^^^^^^^
Now that we have two sides of our navigation triangle, we can work out the course angle using tangent right triangle rule:

.. math::
    Course \angle &= tan^{-1}(Departure_{nm} \div D'Lat_{min}) \\
    Course \angle &= tan^{-1}(125.632409 \div 101.00) \\
    \\
    Course \angle &= 51.20306099°

The directions of the course angle are taken from the D'Lat, and then the D'Lon, in that order, because we always construct the triangle by going south or north first.

.. math::
    Course \angle &= S 51.20306099° E \\
    Course &= 180° - 51.20306099° \\
    \\
    Course &= 129° (T)

It's pretty hard to steer to decimals of a degree so we'll round the true course off.


Distance
^^^^^^^^^^^^^^^^^
Using the course angle we can now find the distance travelled (the hypotenuse of our navigation triangle) using the cosine right triangle rule.

.. math::
    Distance_{nm} &= D'Lat_{min} \div \cos (Course \angle) \\
    Distance_{nm} &= 101.00 \div 51.20306099 \\
    \\
    Distance_{nm} &= 161.1970911

Answer
^^^^^^^^^^^^^^^^^^^
Once you're finished with a question you probably don't need all the decimal points, so lets round the distance down to two places:

.. math::
    Distance &= 161.20 \text{ nautical miles} \\
    Course &= 129°(T)

Question Generator: A to B
--------------------------

.. raw:: html

    <div class="PlaneSailingAB">
    </div>

Next up we have :doc:`./mercator_sailing`.
