# The Ampulancer #
## A Sampler, Amplitude Modulator, Sequencer and Visualizer

This is the combined final project for two classes in the Creative Coding and Immersive Technologies Certificate at Portland Community College.

### Part 1: The Server ###
This was a local Node.js server that serves static sites for visualizing data sent as OSC messages
running a websocket that receives OSC messages and distributes them to any browser connected to the 
websocket. OSC messages either control visualization parameters or contain data to be visualized. The 
PureData patch described below routes messages from teh TouchOSC App and generates messages containing 
real-time audio parsing data.

Part 1:
The Patch

Part 3:
The Visualizer

