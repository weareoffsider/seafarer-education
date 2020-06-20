Fundamentals in Navigation
===========================

Navigation is fundamentally about finding your position on the Earth, and then deciding where to go next, so it stands to reason that how we define our position is pretty important.

Earth: an oblate spheroid
-----------------------------
Earth is close to a sphere, but `it is not perfectly round <https://www.scientificamerican.com/article/earth-is-not-round/>`_, which makes it an oblate spheroid. It is slightly wider than it is tall (about 21 kilometres) and while this doesn't factor in to our navigation processes often, it's important to know that this is the case.

Coordinates on the Earth
------------------------
When we consider our position on the Earth, we use lines of latitude (parallels) and longitude (meridians). Lines of latitude travel east and west while lines of longitude travel north and south, meeting at the poles.

.. raw:: html

    <p><a href="https://commons.wikimedia.org/wiki/File:Division_of_the_Earth_into_Gauss-Krueger_zones_-_Globe.svg#/media/File:Division_of_the_Earth_into_Gauss-Krueger_zones_-_Globe.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Division_of_the_Earth_into_Gauss-Krueger_zones_-_Globe.svg/1200px-Division_of_the_Earth_into_Gauss-Krueger_zones_-_Globe.svg.png" alt="Division of the Earth into Gauss-Krueger zones - Globe.svg"></a><br>By <a href="//commons.wikimedia.org/wiki/User:Hellerick" title="User:Hellerick">Hellerick</a> - <span class="int-own-work" lang="en">Own work</span>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=26737079">Link</a></p>

Because lines of longitude meets at the poles, they get closer and closer the further north or south you travel. Lines of Latitude, on the other hand, are evenly spaced all the way up to the poles.


Degrees, Minutes, and Sign
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
We measure latitude and longitude in degrees. A full circle has 360 degrees, and in each degree is 60 minutes. In each minute there are 60 seconds as well, however they are not used in Latitude and Longitude measurements, they will always be expressed as degrees and minutes, for example: :math:`45° 15.34'`.

Latitude is measured in relation to the equator, so parallels north of the equator would be :math:`20° 12.00' N` while parallels south would be :math:`20° 12.00' S`.

Longitude is measured in relation to the **prime meridian** which is accepted to be close to Greenwich, but there's a `whole history there <https://en.wikipedia.org/wiki/IERS_Reference_Meridian>`_ which we're not going to get in to. Meridians east of the prime meridian would be :math:`75° 30.00' E`, while meridians to the west would be :math:`75° 30.00' W`. Unlike Latitude, Longitude meets at the anti meridian, which is 180° east or west of the prime meridian.

With all this, there are 90° north and south of latitude, and 180° east and west of longitude.

Position
^^^^^^^^^^
Any position on Earth can be described using latitude and longitude:

.. math::
    Latitude &= 30° 13.45' S \\
    Longitude &= 67° 11.45' E

Distances
^^^^^^^^^^
At sea the main measure of distance we use is the nautical mile. It is defined as exactly 1,852 metres, although it has a very close relationship with lines of latitude. One minute of latitude used to be considered a nautical mile, but because that changes: Earth is an oblate spheroid so 1 minute = 1,861 metres at the poles and 1,843 metres at the equator [#f1]_, it was standardised down to the average.

Generally that detail is ignored, so typically in calculations and on charts you will use Latitude as a scale of distance, with one minute equalling 1,852 metres.

.. [#f1] McNish, Larry. "RASC Calgary Centre - Latitude and Longitude". The Royal Astronomical Society of Canada. - https://calgary.rasc.ca/latlong.htm


Directions
^^^^^^^^^^^^^^^

Directions are measured by degrees as well, with 000° pointing North, 090° pointing East, 180° pointing South and 270° pointing West.

The direction is also referenced to true North :math:`156° T`, Magnetic North :math:`156° M`, or Compass North :math:`156° C`, and it is important to always be specific about which reference point a direction is using.

**True** directions are how we ideally navigate on charts and on calculations.

**Magnetic** directions are required for using a Magnetic Compass, and are determined by the magnetic field at a particular location in the world (referred to as Variation).

**Compass** directions are specific to your particular Magnetic Compass, and are determined by the magnetic interference of your own ship at particular heading (referred to as Deviation).

