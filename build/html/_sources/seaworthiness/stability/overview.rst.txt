Overview of Stability
======================

There is a lot of detail in stability, and when we dive in to that detail it can be very easy to lose track of the bigger picture. That's a shame, because with every concept being so related to one another, it's extremely important to understand how everything fits together.

With that in mind, let's go over the major concepts of stability and how they all fit together.

Gravity and Bouyancy
--------------------------------
Stability is primarily the study of gravity and bouyancy, two opposing forces which together result in a ship floating. Gravity pulls objects straight down, and is stronger the heavier the objects are. Bouyancy pushes upwards on any object within a fluid (although in stability we focus on water), and gets stronger when the object takes up more space within the water.

That's a simplification of course, but it is the core concept. Gravity pulls down, and bouyancy pushes up, and when those two forces are in balance a vessel will float. If gravity is stronger than bouyancy, the vessel will sink, and if bouyancy becomes stronger than gravity, the vessel will rise until the forces are in balance.

Gravity
-------------------------
If you had a block of wood, gravity would pull that block of wood downwards, pulling at the exact centre of that block of wood. This is called the centre of gravity. It's very easy to calculate the centre of gravity for a block that is all made of the same material, be it steel, wood, or whatever, if the material is of a uniform density, the centre of gravity will be in the exact centre of the object.

If we bolted a small block of steel on to the block of wood, the **rigid body** they form would have a new centre of gravity, which we could find by combining their weights and centres of gravity together, and then dividing it all by their combined weight. This is the basic process of ALL centre of gravity calculations, combining objects with known weight and centres of gravity, and then finding the new centre.

Lightweight Ship
^^^^^^^^^^^^^^^^^^^^
Adding weights together is much more complex with a ship, because it is made of a wide variety of materials, is hollow, and has a large amount of pieces that make it up. Instead of trying to measure each piece one by one, shipbuilders will conduct an inclining experiment to find the weight and centre of gravity of the ship when it is nearly ready to launch.

This state of the ship is called lightweight. It aims to measure the ship at a point in time when it is completely constructed and all of it's machinery is fitted. It should otherwise be completely empty, no water in ballast tanks, no oils, no cargo, no stores, no crew, no passengers, and so on.

The result of the inclining experiment will give us the weight and centre of gravity of the lightweight ship. This serves as a starting point for all future stability calculations.

.. note::

   The Lightweight Ship will change over time. When machinery is replaced, when new structures are built, whenever the vessel structure is altered permanently, the lightweight ship is changed. A significant enough change will require that an inclining experiment is done again to find the new weight and centre of gravity of the lightweight ship.

Deadweight
^^^^^^^^^^^^^^^^^^^^
All the things that were missing during the inclining experiment are considered the ship's deadweight. This is what a ship carries, fuel oil, lubricating oil, cargo, stores, crew, passengers, and so on. These items can be measured and added one by one to the ship's lightweight, to eventually find the ship's loaded weight and centre of gravity.

Ships will have a range of deadweight states to consider, and will have stability information calculated for each condition, for example: fully loaded, ballast only, departing with full fuel tanks, arriving with low fuel tanks, and so on.

With that, we know all the objects that are weighing a vessel down, adding to the force of gravity that pulls straight downwards through the centre of gravity. That force is opposed by bouyancy.

Bouyancy
----------------------
Any object that is surrounded by a gas or a liquid is subject to bouyancy, a force caused by all the liquid or gas surrounding an object exerting pressure on it. The strength of that pressure depends on how dense the gas or liquid is, and how much space the object takes up within the gas or liquid.

Speaking more specifically about ships, the strength of bouyancy depends on how much space the ship takes up within the water (often referred to as the underwater shape) and how dense the water is. Freshwater has a density of 1 ton per cubic metre, while saltwater has a density of 1.025 tons per cubic metre, making bouyancy slightly stronger within saltwater.

Displacement
^^^^^^^^^^^^^^^^^^^^^^^
When a ship is placed in water, it is said to **displace** the water. The ship's weight is referred to as its **displacement**, which is simply the amount of water displaced by the ship, measured in tonnes. We know this is the case, because once a ship is floating and has settled, the force of gravity must be perfectly balanced by the force of bouyancy. This is how the ship is weighed in an inclining experiment, we know the exact shape of the vessel, how far it has sunk in to the water (the draught), the density of the water, and with all those pieces of information we can calculate the displacement of the vessel.

Centre of Bouyancy
^^^^^^^^^^^^^^^^^^^^^^^^
The centre of bouyancy is the exact centre of the underwater shape of a vessel. This can be worked out mathematically so long as the ship's construction plans were followed exactly and the ship's draught is known. That can be quite a long process, so in practice the centre of buoyancy will be calculated for a range of drafts from lightship to fully loaded, so the information can be used for other stability calculations.


