Sailings
==================

Sailings are the calculation of line of travel across the surface of the Earth. The complication from calculation comes from the fact that the Earth is spherical, yet we typically navigate on a flat plane (the Mercator Projection) with straight line courses.

Difference in Latitude
--------------------------------
When comparing two positions, you will have to know how far, and which direction you are travelling (North, South, East, West). For North and South this is far easier.

.. math::
    60°S \longrightarrow 30°N = D'Lat = 90° N

The latitudes are in different hemispheres, so the Difference in Latitude (D'Lat) is the two latitudes added together: :math:`60° + 30° = 90°` and it is signed North because the destination is signed North.

.. math::
    60°S \longrightarrow 30°S = D'Lat = 30° N

If the latitudes are in the same hemisphere, you subtract the latitudes: :math:`60° - 30° = 30°`. If the destination is a smaller latitude, it is signed opposite the latitude, in this case North.

.. math::
    30°S \longrightarrow 60°S = D'Lat = 30° S

Technically you could still subtract the latitudes here: :math:`30° - 60° = -30°`. Just make it positive and it will still be correct, and because the destination is a larger latitude, it is signed the same as the destination, in this case South.

Difference in Longitude
------------------------

Differences in Longitude use similar rules, except for the fact that when travelling across hemispheres (East to West and vice versa) you have to determine which way around is the shortest. For example:

.. math::
    60°E \longrightarrow 30°W = D'Lon = 90° W

In this case, we are travelling to the West, and we know this is the shortest way because when we add the two longitudes together it is below 180°. On the other hand:

.. math::
    160°E \longrightarrow 150°W = D'Lon = 50° E

Here if we add them together we get 310°. Because that's over 180°, we need to do one last step and subtract that from 360° to get the shorter way around. :math:`360° - 310° = 50°` and then we use the sign on the starting point, in this case East.

Using D'Lat and D'Lon
---------------------

In many sailings you will need to use D'Lat and D'Lon in minutes, rather than degrees to get the correct answer. In the formulas we will make this clear with D'Lon(minutes). Turn degrees in to minutes just by multiplying them by 60.

.. math::
    D'Lon(minutes) = D'Lon(degrees) * 60

.. math::
    D'Lon(degrees) = D'Lon(minutes) \div 60

.. math::
    D'Lat(minutes) = D'Lat(degrees) * 60

.. math::
    D'Lat(degrees) = D'Lat(minutes) \div 60

Course Angles
----------------
Because sailings are trigonometry problems, you don't use Courses (000 to 359), directly, but rather use Course Angles. Course Angles are given like so:

.. math::
    N 45° W = 315°
.. math::
    N 32° E = 032°

Which cardinal direction is first matters. :math:`W 20° N` is West (270°) plus 20° Northwards, so it is 290°, whereas :math:`S 20° E` would be South (180°) minus 20° Eastwards, so it is 160°.

You get the cardinal directions based on the difference between Latitude and Longitude. Typically course angles should be North/South followed by East/West. That way your formulas will always be the same, treating D'Lat as the adjacent side in the triangle, and Departure as the opposite side.

Meridian Distance
------------------
Not something people usually bring up, because there's a direct relationship between Latitude and Nautical Miles, but it's a building block to understanding how position works. Every degree has 60 minutes, and each minute of Latitude is one nautical mile, so:

.. math::
    Distance(nm) = D'Lat(degrees) * 60

Parallel Sailing
-----------------
The most simple of all sailings is Parallel Sailing. This involves a course that remains on the same Latitude at all times, either sailing exactly West (270) or exactly East (090).

Find the difference in Longitude, and then multiply it the Cosine of Latitude.

.. math::
    Departure(nm) = D'lon(minutes) * \cos Latitude(degrees)

Plane Sailing
-----------------
Plane Sailing uses the same concept as Parallel Sailing, using the Cosine of Latitude to convert Longitude to Nautical Miles. Because we're moving to a new Latitude we work things out as a right angled triangle.

.. raw:: html

    <div style="padding-bottom: 50%; position: relative;">
        <svg id="pl1" class="plane-sailing-diagram" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></svg>
    </div>

Finding Course and Distance
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Get the Difference in Latitude(D'Lat) and Longitude(D'Lon) between the two points. You'll also need the Mean Latitude(M'Lat), the midpoint between the origin and the destination.

Using the M'Lat we can find our departure as with Parallel Sailing:

.. math::
    Departure(nm) = D'lon(minutes) * \cos M'Lat(degrees)

We use M'Lat as a rough approximation, which is why Plane Sailing is not accurate at longer distances. After we have the Departure we can find the Course Angle. The Course Angle is signed the same as the D'Lat and then D'Lon.

.. math::
    Course \angle = tan^{-1}(Departure(nm) \div D'Lat(minutes))

.. math::
    Distance(nm) = D'Lat(minutes) \div \cos Course \angle






