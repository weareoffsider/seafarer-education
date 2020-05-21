Digital Charts
=================

Before talking about Digital Chart Systems, it's important to understand the two categories of Digital Charts there can be. A chart can either be in a **Raster** or a **Vector** format, and to illustrate this lets talk briefly about images rather than charts.

**Raster** images only store pixels, pixels being the individual dots that make up a picture. When you zoom in to a raster image, there is not any new information to be seen, so the pixels just get larger and larger.

**Vector** images instead store information about how the image was constructed. Where the lines are, how thick they are, what colour, blocks of text, numbers and so on. That information is then converted in to an image when your computer looks at it, appropriate to the level of zoom you've used.

.. raw:: html

    <p><a href="https://commons.wikimedia.org/wiki/File:VectorBitmapExample.svg#/media/File:VectorBitmapExample.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/VectorBitmapExample.svg/1200px-VectorBitmapExample.svg.png" alt="VectorBitmapExample.svg"></a><br>By The original uploader was <a href="https://en.wikipedia.org/wiki/User:Darth_Stabro" class="extiw" title="wikipedia:User:Darth Stabro">Darth Stabro</a> at <a href="https://en.wikipedia.org/wiki/" class="extiw" title="wikipedia:">English Wikipedia</a>. - Transferred from <span class="plainlinks"><a class="external text" href="https://en.wikipedia.org">en.wikipedia</a></span> to Commons by <a href="//commons.wikimedia.org/wiki/User:Pbroks13" title="User:Pbroks13">Pbroks13</a> using <a href="https://tools.wmflabs.org/commonshelper/" class="extiw" title="toollabs:commonshelper/">CommonsHelper</a>., <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=15789788">Link</a></p>

Because Vector images store information and not pixels, they can pack a lot more detail in them. Rather than storing every pixel for a square that's 400 by 400 pixels, a vector format can just say that's there's a 400 by 400 square and what colour it is, and the computer can fill in the rest.

These differences are important to keep in mind when we start talking about **Raster** and **Vector** charts.

Raster Charts
-----------------
`Raster charts <https://www.admiralty.co.uk/digital-services/digital-charts/admiralty-raster-chart-service?selectTab=Features>`_ only store the pixels of the chart. Just like a paper chart, the information that is on the chart is all that you'll be able to see. Zooming in will not give you any new information, and eventually be pixellated. You can't rotate the chart without the text and depth soundings also rotating.

With these drawbacks, you might wonder why Raster Charts are common. The production process for creating a Raster Chart is essentially identical to that of a paper chart, all a Hydrographic organisation needs to do is scan an existing paper chart or output them directly to Raster from their production process. If there is a current paper chart for an area, there is almost certainly a way to get a current raster chart for that area as well.

Vector Charts
-------------------
`Vector charts <https://www.admiralty.co.uk/digital-services/digital-charts/admiralty-vector-chart-service>`_ don't store what a chart looks like, but rather the **information** that exists on a chart. Exact positions and characteristics of depth soundings, depth contour lines, buoys, lighthouses, and all other features relevant to navigation. The computer is responsible for drawing that information on screen (and for certain equipment that means adhering to software standards).

The fact that Vector Charts only store information gives them functionality that Raster Charts can't achieve. The depth soundings are machine readable, so the computer can warn you when your vessel is headed in to danger. You can click on a light and potentially get more detailed information. You can show and hide information - a potentially dangerous feature but more on that later.

The only reason Vector Charts aren't universal is partially for familiarity - it's a new technology with it's own risks that require training - and partially because they are more effort to produce. Hydrographic organisations need to ensure their Vector information is stored in a format that navigation software can use effectively, and that requires new production processes which Raster Charts don't require.

Nonetheless, at the time of writing most of the world is covered by quality Vector Charts issued by a governmental Hydrographic office, so Raster charts have dwindling relevancy in digital navigation.

Raster Vector Hybrids
---------------------
Out of historical interest, in the early days of digital charts there were such things as Raster Vector Hybrid Charts, which had a base layer of the Raster Chart, and then had vector information laid over the top, such as lights, marks, and potentially soundings. These aren't common these days, but it is an example of how Hydrographic offices bridged the gap when they weren't fully equipped to produce proper Vector charts.


Raster - Vector Comparisons
---------------------------

It's good to know the ways the two formats can be compared, as it highlights how their capabilities differ.

.. csv-table:: Raster Vector Comparison
    :header: "", "Raster", "Vector"

    "Training", "Requires no additional training for reading - Less usage training required.", "Requires training for correct configuration, reading and usage."
    "Production", "Uses same process as paper charts.", "Created and distributed with different processes."
    "Cost", "Typically cheaper.", "Typically more expensive and subscription based."
    "Visibility", "All chart information visible at all times.", "Visible information is customised by the officer."
    "Zooming", "Pixellates when zoomed in.", "Can zoom in while still having sharp lines and iconography."
    "Rotation", "Cannot be readably rotated.", "Can rotate while keeping text correctly oriented."
    "File Size", "Larger", "Smaller"
    "Chart Seams", "Charts do not join together, must select which charts to display", "Chart information is seamlessly joined, the software selecting the appropriate charts to load for your current viewport."
    "Alarm Settings", "Can't trigger alarms based on pixel information.", "Can trigger alarms based on sounding information."



Using Digital Charts
--------------------
Using Raster or Vector charts requires software and equipment that can read and display them. Also, they have to adhere to certain standards in order to be used in an official capacity as a primary means of navigation, so at this point it makes sense to look in to :doc:`./digital_charting_standards`.









