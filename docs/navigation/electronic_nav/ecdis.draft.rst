ECDIS
===========

ECDIS stands for Electronic Chart Display and Information System. The ECDIS brings together a range of information and data traditionally separated in the bridge - charts, RADAR, Compass, AIS, and so on - and displays that data all together on a single screen.

ECDISs must meet IMO/SOLAS requirements to be classed as an ECDIS, otherwise they may merely be an Electronic Chart System. ECSs share properties with ECDISs, and can be used to assist navigation, but CAN NOT be depended on to the extent an ECDIS is.

SOLAS Chapter V: Regulation 19 [SOLASV19]_ stipulates the carriage requirements for an ECDIS system, all new build vessels of 500 gross tonnage of greater must have an ECDIS system.

.. [SOLASV19] SOLAS Chapter V - Regulation 19 - http://solasv.mcga.gov.uk/regulations/regulation19.htm

What ECDIS adds for Navigation
-----------------------------------

**Digital Nautical Charts** - instead of single layer printed nautical charts, ECDIS charts are stored as points of information. The officer can select which information to display from these Digital Nautical Charts, which gives more flexibility to visual density and points of interest, but has risks if the mariner is not aware of information they have turned off.

**Quicker Planning Processes** - the interface of digital charts allows an officer to very quickly create and view a passage plan with accurate distances and courses, to allow for a far faster planning process.

**Near Real Time Positioning** - having position information constantly fed in from the GPS/GNSS system means provided that the position is accurate is accurate, you will have a near real time position on a digital chart.

**Integrated Traffic Data** - RADAR and AIS integration can provide an additional level of situational awareness (or clutter) in the context of a digital chart.

**Quick Route Monitoring** - having near real time positioning and integrated traffic data will allow for the officer to have lots of information available for the purpose of route monitoring.


Electronic Charts
------------------

Raster Charts
^^^^^^^^^^^^^^^
This is a simple pixel representation of a standard paper chart. It will be set to a single zoom level, and can not show any extra detail when zooming in and out. There is also no semantic information, the chart software can't tell what the depths are, where the obstructions are, and as such a lot of the benefits of a true electronic chart are lost. There's also no way to readably rotate the chart as any rotation would also rotate text and digits.

The main benefits of Raster Charts come with user familiarity, if you're familiar with paper charts you can read raster Charts. You also can't accidentally remove important information like you could potentially with a customisable Electronic Navigation Charts.

From the production side Raster Charts are also cheap to produce, as the same workflow that produces Paper Charts can also create a Raster Chart. These charts are considered a fallback however, and no longer compliant with the official needs of an Electronic Navigation Chart for an ECDIS system. Ideally users should instead be working on Vector Charts.

Vector Charts
^^^^^^^^^^^^^^^^^^
Instead of a pixel representation of a chart, Vector Charts record all the **information** in a geographical information system. Depths, contours, landmarks, hazards, information, are all stored with their exact latitude and longitude coordinates as well as well as precise information. That means the chart reading software can turn that information in to a display suitable to the current level of zoom and officer preferences.

Vector Charts still have an ideal level of zoom, referred to as the compilation scale, but you have more flexibility to zoom in and out as the situation demands.

Electronic Navigation Charts
----------------------------
Electronic Navigation Charts are a standardised file format with all the chart information necessary for safe navigation. It is not possible to view an ENC without the ECDIS software to turn it into something readable and usable for navigation.

System Electronic Navigation Charts
-------------------------------------
SENCs are the Electronic Chart after it has been loaded in to the ECDIS.

Chart Layers
----------------------------

Base Display
^^^^^^^^^^^^^^
Must always be displayed. Can't be used for navigation alone.

Coastline
Safety Contour
Isolated Underwater dangers less than the safety contour
Isolated dangers within safe water
north arrow
units of depth and height
display mode

Standard Display
^^^^^^^^^^^^^^^^^
most of the detail needed for safe navigation

All Other Information Display
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
spot soundings
submarine cables and pipelines
details of all isolated dangers
aids to navigation
contents of cautionary notes
chart update
graticule
place names
ENC edition date


An electronic navigation chart is constructed of layers. There is standardisation of symbols used at this point: https://www.admiralty.co.uk/news/blogs/the-quick-guide-to-enc-symbols - which can be used for basic interpretation of charts.






