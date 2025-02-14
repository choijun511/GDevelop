describe('gdjs.PlatformerObjectRuntimeBehavior', function () {
  const epsilon = 1 / (2 << 8);

  const makeTestRuntimeScene = () => {
    const runtimeGame = new gdjs.RuntimeGame({
      variables: [],
      resources: {
        resources: [],
      },
      properties: { windowWidth: 800, windowHeight: 600 },
    });
    const runtimeScene = new gdjs.RuntimeScene(runtimeGame);
    runtimeScene.loadFromScene({
      layers: [{ name: '', visibility: true, effects: [] }],
      variables: [],
      behaviorsSharedData: [],
      objects: [],
      instances: [],
    });
    runtimeScene._timeManager.getElapsedTime = function () {
      return (1 / 60) * 1000;
    };
    return runtimeScene;
  };

  const addPlatformObject = (runtimeScene) => {
    const platform = new gdjs.TestRuntimeObject(runtimeScene, {
      name: 'obj2',
      type: '',
      behaviors: [
        {
          type: 'PlatformBehavior::PlatformBehavior',
          name: 'Platform',
          canBeGrabbed: true,
        },
      ],
      effects: [],
    });
    platform.setCustomWidthAndHeight(60, 32);
    runtimeScene.addObject(platform);

    return platform;
  };

  const addUpSlopePlatformObject = (runtimeScene) => {
    const platform = new gdjs.TestSpriteRuntimeObject(runtimeScene, {
      name: 'slope',
      type: '',
      behaviors: [
        {
          type: 'PlatformBehavior::PlatformBehavior',
          name: 'Platform',
          canBeGrabbed: true,
        },
      ],
      effects: [],
      animations: [
        {
          name: 'animation',
          directions: [
            {
              sprites: [
                {
                  originPoint: { x: 0, y: 0 },
                  centerPoint: { x: 50, y: 50 },
                  points: [
                    { name: 'Center', x: 0, y: 0 },
                    { name: 'Origin', x: 50, y: 50 },
                  ],
                  hasCustomCollisionMask: true,
                  customCollisionMask: [
                    [
                      { x: 100, y: 100 },
                      { x: 0, y: 100 },
                      { x: 100, y: 0 },
                    ],
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    runtimeScene.addObject(platform);
    platform.setUnscaledWidthAndHeight(100, 100);
    platform.setCustomWidthAndHeight(100, 100);

    return platform;
  };

  const addDownSlopePlatformObject = (runtimeScene) => {
    const platform = new gdjs.TestSpriteRuntimeObject(runtimeScene, {
      name: 'slope',
      type: '',
      behaviors: [
        {
          type: 'PlatformBehavior::PlatformBehavior',
          name: 'Platform',
          canBeGrabbed: true,
        },
      ],
      effects: [],
      animations: [
        {
          name: 'animation',
          directions: [
            {
              sprites: [
                {
                  originPoint: { x: 0, y: 0 },
                  centerPoint: { x: 50, y: 50 },
                  points: [
                    { name: 'Center', x: 0, y: 0 },
                    { name: 'Origin', x: 50, y: 50 },
                  ],
                  hasCustomCollisionMask: true,
                  customCollisionMask: [
                    [
                      { x: 100, y: 100 },
                      { x: 0, y: 100 },
                      { x: 0, y: 0 },
                    ],
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    runtimeScene.addObject(platform);
    platform.setUnscaledWidthAndHeight(100, 100);
    platform.setCustomWidthAndHeight(100, 100);

    return platform;
  };

  const addTunnelPlatformObject = (runtimeScene) => {
    const platform = new gdjs.TestSpriteRuntimeObject(runtimeScene, {
      name: 'slope',
      type: '',
      behaviors: [
        {
          type: 'PlatformBehavior::PlatformBehavior',
          name: 'Platform',
          canBeGrabbed: true,
        },
      ],
      effects: [],
      animations: [
        {
          name: 'animation',
          directions: [
            {
              sprites: [
                {
                  originPoint: { x: 0, y: 0 },
                  centerPoint: { x: 50, y: 50 },
                  points: [
                    { name: 'Center', x: 0, y: 0 },
                    { name: 'Origin', x: 50, y: 50 },
                  ],
                  hasCustomCollisionMask: true,
                  customCollisionMask: [
                    [
                      { x: 0, y: 0 },
                      { x: 0, y: 100 },
                      { x: 100, y: 100 },
                      { x: 100, y: 0 },
                    ],
                    [
                      { x: 0, y: 200 },
                      { x: 0, y: 300 },
                      { x: 100, y: 300 },
                      { x: 100, y: 200 },
                    ],
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    runtimeScene.addObject(platform);
    platform.setUnscaledWidthAndHeight(100, 300);
    platform.setCustomWidthAndHeight(100, 300);

    return platform;
  };

  const addJumpThroughPlatformObject = (runtimeScene) => {
    const platform = new gdjs.TestRuntimeObject(runtimeScene, {
      name: 'obj2',
      type: '',
      behaviors: [
        {
          type: 'PlatformBehavior::PlatformBehavior',
          name: 'Platform',
          platformType: 'Jumpthru',
          canBeGrabbed: false,
        },
      ],
      effects: [],
    });
    platform.setCustomWidthAndHeight(60, 32);
    runtimeScene.addObject(platform);

    return platform;
  };

  const addLadderObject = (runtimeScene) => {
    const ladder = new gdjs.TestRuntimeObject(runtimeScene, {
      name: 'obj3',
      type: '',
      behaviors: [
        {
          type: 'PlatformBehavior::PlatformBehavior',
          name: 'Platform',
          canBeGrabbed: false,
          platformType: 'Ladder',
        },
      ],
      effects: [],
    });
    ladder.setCustomWidthAndHeight(20, 60);
    runtimeScene.addObject(ladder);

    return ladder;
  };

  describe('(falling)', function () {
    let runtimeScene;
    let object;
    let platform;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object in the air.
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 900,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 1500,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);
      object.setPosition(0, -100);

      // Put a platform.
      platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);
      runtimeScene.renderAndStep(1000 / 60);
    });

    it('can fall when in the air', function () {
      for (let i = 0; i < 30; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
        if (i < 10) expect(object.getBehavior('auto1').isFalling()).to.be(true);
        if (i < 10)
          expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
            true
          );
      }

      //Check the platform stopped the platformer object.
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      for (let i = 0; i < 35; ++i) {
        //Check that the platformer object can fall.
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getX()).to.be.within(87.5, 87.51);
      expect(object.getY()).to.be(-24.75);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);

      for (let i = 0; i < 100; ++i) {
        //Let the speed on X axis go back to 0.
        runtimeScene.renderAndStep(1000 / 60);
      }
    });

    it('falls when a platform is moved away', function () {
      object.setPosition(0, -32);
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      //Check the object is on the platform
      expect(object.getY()).to.be.within(-31, -30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // move the platform away
      platform.setPosition(-100, -100);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);
    });

    it('falls when a platform is removed', function () {
      object.setPosition(0, -32);
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      // Check the object is on the platform
      expect(object.getY()).to.be.within(-31, -30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Remove the platform
      runtimeScene.markObjectForDeletion(platform);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);
    });
  });

  [
    // less than 1 pixel per frame (50/60)
    50,
    // a commonly used value
    1500,
  ].forEach((maxFallingSpeed) => {
    describe(`(on floor, maxFallingSpeed=${
      maxFallingSpeed / 60
    } pixels per frame)`, function () {
      let runtimeScene;
      let object;
      let platform;

      beforeEach(function () {
        runtimeScene = makeTestRuntimeScene();

        // Put a platformer object in the air.
        object = new gdjs.TestRuntimeObject(runtimeScene, {
          name: 'obj1',
          type: '',
          behaviors: [
            {
              type: 'PlatformBehavior::PlatformerObjectBehavior',
              name: 'auto1',
              gravity: 900,
              maxFallingSpeed: maxFallingSpeed,
              acceleration: 500,
              deceleration: 1500,
              maxSpeed: 500,
              jumpSpeed: 1500,
              canGrabPlatforms: true,
              ignoreDefaultControls: true,
              slopeMaxAngle: 60,
            },
          ],
          effects: [],
        });
        object.setCustomWidthAndHeight(10, 20);
        runtimeScene.addObject(object);
        object.setPosition(0, -100);

        // Put a platform.
        platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
      });

      // TODO The character falls one frame then land instead of staying on the platform.
      it.skip('must not move when on the floor at startup', function () {
        object.setPosition(0, platform.getY() - object.getHeight());

        for (let i = 0; i < 10; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
          // Check the platformer object stays still.
          expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
          expect(object.getBehavior('auto1').isFalling()).to.be(false);
          expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
            false
          );
          expect(object.getBehavior('auto1').isMoving()).to.be(false);
        }
      });

      it('must not move when put on a platform while falling', function () {
        object.setPosition(0, platform.getY() - object.getHeight() - 300);

        for (let i = 0; i < 10; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
          expect(object.getBehavior('auto1').isFalling()).to.be(true);
          expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
            true
          );
        }

        object.setPosition(0, platform.getY() - object.getHeight());

        for (let i = 0; i < 10; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
          // Check the platformer object stays still.
          expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
          expect(object.getBehavior('auto1').isFalling()).to.be(false);
          expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
            false
          );
          expect(object.getBehavior('auto1').isMoving()).to.be(false);
        }
      });

      it('can track object height changes', function () {
        //Put the object near the right ledge of the platform.
        object.setPosition(
          platform.getX() + 10,
          platform.getY() - object.getHeight() + 1
        );

        for (let i = 0; i < 15; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
        }

        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
        expect(object.getX()).to.be(10);
        expect(object.getY()).to.be.within(-31, -30); // -30 = -10 (platform y) + -20 (object height)

        object.setCustomWidthAndHeight(object.getWidth(), 9);
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
        expect(object.getY()).to.be(-19); // -19 = -10 (platform y) + -9 (object height)

        for (let i = 0; i < 10; ++i) {
          object.getBehavior('auto1').simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(object.getBehavior('auto1').isFalling()).to.be(false);
          expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
            false
          );
        }
        expect(object.getY()).to.be(-19);
        expect(object.getX()).to.be.within(17.638, 17.639);

        object.setCustomWidthAndHeight(object.getWidth(), 20);
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      });

      it('can track platform angle changes', function () {
        // The initial pltaforms AABB are put in RBush.
        runtimeScene.renderAndStep(1000 / 60);

        // Now change the angle to check that the AABB is updated in RBush.
        platform.setAngle(90);

        // Put the character above the rotated platform.
        object.setPosition(
          platform.getX() + platform.getWidth() / 2,
          platform.getY() +
            (platform.getHeight() - platform.getWidth()) / 2 -
            object.getHeight() -
            10
        );

        for (let i = 0; i < 15; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
        }

        // The character should land on it.
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
        expect(object.getX()).to.be(30);
        expect(object.getY()).to.be(-44);
      });
    });
  });

  describe('Floating-point error mitigations', function () {
    it('Specific coordinates with slopeMaxAngle=0 creating Y oscillations and drift on a moving floor', function () {
      const runtimeScene = makeTestRuntimeScene();

      // Create a Sprite object that has the origin at a specific position (see below)
      // and that has a slope max angle of 0 (so it can't climb on a floor even if it's a bit higher
      // than the bottom of the object).
      const object = new gdjs.TestSpriteRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 1300,
            maxFallingSpeed: 1000,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 280,
            jumpSpeed: 750,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 0,
            jumpSustainTime: 0.2,
          },
        ],
        effects: [],
        animations: [
          {
            name: 'animation',
            directions: [
              {
                sprites: [
                  {
                    originPoint: { x: 5, y: 19 },
                    centerPoint: { x: 5, y: 46 },
                    points: [
                      { name: 'Center', x: 5, y: 46 },
                      { name: 'Origin', x: 5, y: 19 },
                    ],
                    hasCustomCollisionMask: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      // Set the size of the object so that it results in a specific
      // Y position for the bottom of the object AABB:
      object.setUnscaledWidthAndHeight(10, 92);
      object.setCustomWidthAndHeight(10, 66.0008);
      // Origin Y is originally 19.
      // After the scaling, it is now 19*66.0008/92=13.6306.

      // Set the Y position so that the object falls at a Y position on the floor
      // that would generate oscillations.
      object.setPosition(0, 139.3118);
      runtimeScene.addObject(object);

      // Put a platform at a specific Y that can cause oscillations.
      const platform = addJumpThroughPlatformObject(runtimeScene);
      platform.setPosition(0, 193.000000000001);
      // This means that the exact Y position the object should take is:
      // platform Y - height + origin Y = 193.000000000001-66.0008+13.6306 = 140.6298

      // Wait for the object to fall on the floor
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(false);

      // Ensure it is on the floor
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      // The Y position won't be exact because of floating point errors.
      // expect(object.getY()).to.be(140.6298)
      expect(object.getY()).to.be.within(140.6297999, 140.6298001);

      // Move the platform by 6 pixels to the right.
      platform.setX(platform.getX() + 1);
      runtimeScene.renderAndStep(1000 / 60);
      platform.setX(platform.getX() + 1);
      runtimeScene.renderAndStep(1000 / 60);
      platform.setX(platform.getX() + 1);
      runtimeScene.renderAndStep(1000 / 60);
      platform.setX(platform.getX() + 1);
      runtimeScene.renderAndStep(1000 / 60);
      platform.setX(platform.getX() + 1);
      runtimeScene.renderAndStep(1000 / 60);
      platform.setX(platform.getX() + 1);
      runtimeScene.renderAndStep(1000 / 60);

      // Ensure the object followed the platform on the X axis.
      // If the floating point errors caused oscillations between two Y positions,
      // it won't work because the object will get repositioned back to its old X position
      // whenever the floor is considered "too high" for the object to reach.
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getY()).to.be.within(140.6297999, 140.6298001);
      expect(object.getX()).to.be(6);
    });
  });

  describe('(grab platforms)', function () {
    let runtimeScene;
    let object;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object in the air.
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 900,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 1500,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);
      object.setPosition(0, -100);
    });

    it('can grab, and release, a platform', function () {
      // Put a platform.
      const platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);
      runtimeScene.renderAndStep(1000 / 60);

      //Put the object near the right ledge of the platform.
      object.setPosition(
        platform.getX() + platform.getWidth() + 2,
        platform.getY() - 10
      );

      for (let i = 0; i < 35; ++i) {
        object.getBehavior('auto1').simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
      }

      //Check that the object grabbed the platform
      expect(object.getX()).to.be.within(
        platform.getX() + platform.getWidth() + 0,
        platform.getX() + platform.getWidth() + 1
      );
      expect(object.getY()).to.be(platform.getY());

      object.getBehavior('auto1').simulateReleasePlatformKey();
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          true
        );
      }

      //Check that the object is falling
      expect(object.getY()).to.be(3.75);
    });

    [true, false].forEach((addTopPlatformFirst) => {
      it('can grab every platform when colliding 2', function () {
        // The 2 platforms will be simultaneously in collision
        // with the object when it grabs one.
        let upperPlatform, lowerPlatform;
        if (addTopPlatformFirst) {
          upperPlatform = addPlatformObject(runtimeScene);
          upperPlatform.setPosition(0, -10);
          upperPlatform.setCustomWidthAndHeight(60, 10);

          lowerPlatform = addPlatformObject(runtimeScene);
          lowerPlatform.setPosition(0, 0);
          lowerPlatform.setCustomWidthAndHeight(60, 10);
        } else {
          lowerPlatform = addPlatformObject(runtimeScene);
          lowerPlatform.setPosition(0, 0);
          lowerPlatform.setCustomWidthAndHeight(60, 10);

          upperPlatform = addPlatformObject(runtimeScene);
          upperPlatform.setPosition(0, -10);
          upperPlatform.setCustomWidthAndHeight(60, 10);
        }

        // Put the object near the right ledge of the platform.
        object.setPosition(
          upperPlatform.getX() + upperPlatform.getWidth() + 2,
          upperPlatform.getY() - 10
        );
        runtimeScene.renderAndStep(1000 / 60);

        for (let i = 0; i < 35; ++i) {
          object.getBehavior('auto1').simulateLeftKey();
          runtimeScene.renderAndStep(1000 / 60);
        }

        // Check that the object grabbed the upper platform
        expect(object.getX()).to.be.within(
          upperPlatform.getX() + upperPlatform.getWidth() + 0,
          upperPlatform.getX() + upperPlatform.getWidth() + 1
        );
        expect(object.getY()).to.be(upperPlatform.getY());
        expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(true);

        // Release upper platform
        object.getBehavior('auto1').simulateReleasePlatformKey();
        for (let i = 0; i < 35; ++i) {
          object.getBehavior('auto1').simulateLeftKey();
          runtimeScene.renderAndStep(1000 / 60);
        }

        // Check that the object grabbed the lower platform
        expect(object.getX()).to.be.within(
          lowerPlatform.getX() + lowerPlatform.getWidth() + 0,
          lowerPlatform.getX() + lowerPlatform.getWidth() + 1
        );
        expect(object.getY()).to.be(lowerPlatform.getY());
        expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(true);
      });
    });

    it('can grab a platform and jump', function () {
      // Put a platform.
      platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);
      runtimeScene.renderAndStep(1000 / 60);

      //Put the object near the right ledge of the platform.
      object.setPosition(
        platform.getX() + platform.getWidth() + 2,
        platform.getY() - 10
      );

      for (let i = 0; i < 35; ++i) {
        object.getBehavior('auto1').simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
      }

      //Check that the object grabbed the platform
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(true);
      expect(object.getX()).to.be.within(
        platform.getX() + platform.getWidth() + 0,
        platform.getX() + platform.getWidth() + 1
      );
      expect(object.getY()).to.be(platform.getY());

      object.getBehavior('auto1').simulateJumpKey();
      //Check that the object is jumping
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
      }
      expect(object.getY()).to.be.below(platform.getY());
    });
  });

  describe('(jump and jump sustain)', function () {
    let runtimeScene;
    let object;
    let platform;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object on a platform
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 1500,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 900,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
            jumpSustainTime: 0.2,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);
      object.setPosition(0, -32);

      // Put a platform.
      platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);
    });

    it('can jump', function () {
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      //Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Jump without sustaining
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 18; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
      }

      // Check that we reached the maximum height
      expect(object.getY()).to.be.within(-180, -179);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be(-180);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-180, -179);

      // Then let the object fall
      for (let i = 0; i < 17; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
      }
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getY()).to.be(-30);
    });

    it('can jump, sustaining the jump', function () {
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      //Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Forbid to jump
      object.getBehavior('auto1').setCanNotAirJump();
      // It has no impact as the object is on a platform.
      expect(object.getBehavior('auto1').canJump()).to.be(true);

      // Jump with sustaining as much as possible, and
      // even more (18 frames at 60fps is greater than 0.2s)
      for (let i = 0; i < 18; ++i) {
        object.getBehavior('auto1').simulateJumpKey();
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the height reached
      expect(object.getY()).to.be(-230);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be(-235);
      for (let i = 0; i < 5; ++i) {
        // Verify that pressing the jump key does not change anything
        object.getBehavior('auto1').simulateJumpKey();
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check that we reached the maximum height
      expect(object.getY()).to.be(-247.5);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be(-247.5);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-247, -246);

      // Then let the object fall
      for (let i = 0; i < 60; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be(-30);
    });

    it('can jump, and only sustain the jump while key held', function () {
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      //Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Jump with sustaining a bit (5 frames at 60fps = 0.08s), then stop
      for (let i = 0; i < 5; ++i) {
        object.getBehavior('auto1').simulateJumpKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be.within(-101, -100);

      // Stop holding the jump key
      runtimeScene.renderAndStep(1000 / 60);

      for (let i = 0; i < 13; ++i) {
        // then hold it again (but it's too late, jump sustain is gone for this jump)
        object.getBehavior('auto1').simulateJumpKey();
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check that we reached the maximum height
      expect(object.getY()).to.be.within(-206, -205);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-208, -207);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-208, -207);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-208, -207);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-206, -205);
      runtimeScene.renderAndStep(1000 / 60);

      // Then let the object fall
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      for (let i = 0; i < 60; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be(-30);
    });

    it('should not jump after falling from a platform', function () {
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object is on the platform
      // So at this point, the object could jump
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Fall from the platform
      for (let i = 0; i < 35; ++i) {
        object.getBehavior('auto1').simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Try to jump
      object.getBehavior('auto1').simulateJumpKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isJumping()).to.be(false);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);
    });

    it('can be allowed to jump in mid air', function () {
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Fall from the platform
      for (let i = 0; i < 20; ++i) {
        object.getBehavior('auto1').simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      // Allow to jump in mid air
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      object.getBehavior('auto1').setCanJump();
      expect(object.getBehavior('auto1').canJump()).to.be(true);

      // Can jump in the air
      object.getBehavior('auto1').simulateJumpKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isJumping()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );

      for (let i = 0; i < 40; ++i) {
        object.getBehavior('auto1').simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getBehavior('auto1').isJumping()).to.be(false);

      // Can no longer to jump
      object.getBehavior('auto1').simulateJumpKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isJumping()).to.be(false);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);
    });

    it('can allow coyote time', function () {
      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Fall from the platform
      for (let i = 0; i < 20; ++i) {
        object.getBehavior('auto1').simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      // Allow to jump
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      object.getBehavior('auto1').setCanJump();
      expect(object.getBehavior('auto1').canJump()).to.be(true);

      // Still falling from the platform
      for (let i = 0; i < 4; ++i) {
        object.getBehavior('auto1').simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Suppose that we miss an eventual time frame or some condition.
      // So we forbid to jump again:
      object.getBehavior('auto1').setCanNotAirJump();
      expect(object.getBehavior('auto1').canJump()).to.be(false);

      // Can no longer to jump in mid air
      object.getBehavior('auto1').simulateJumpKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isJumping()).to.be(false);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);
    });

    it('should not grab a platform while in the ascending phase of a jump', function () {
      const topPlatform = addPlatformObject(runtimeScene);
      topPlatform.setPosition(12, -80);
      runtimeScene.renderAndStep(1000 / 60);

      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Jump without sustaining
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 3; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
      }
      // the object is against the platform side
      expect(object.getY()).to.be.within(
        topPlatform.getY(),
        topPlatform.getY() + object.getHeight()
      );

      // try to grab the platform
      for (let i = 0; i < 20; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
      }
      // Check that the object didn't grabbed the platform
      expect(object.getX()).to.be.above(
        topPlatform.getX() - object.getWidth() + 20
      );
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(false);
    });

    it('can grab a platform while in the descending phase of a jump', function () {
      const topPlatform = addPlatformObject(runtimeScene);
      topPlatform.setPosition(12, -120);
      runtimeScene.renderAndStep(1000 / 60);

      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Jump, reach the top and go down
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 30; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
      }
      // the object is against the platform side
      expect(object.getY()).to.be.within(
        topPlatform.getY() - object.getHeight(),
        topPlatform.getY()
      );

      // Verify the object is in the falling state of the jump:
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );

      // try to grab the platform
      for (let i = 0; i < 30; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      // Check that the object grabbed the platform
      expect(object.getY()).to.be(topPlatform.getY());
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(true);
    });

    it('should not grab a platform while walking', function () {
      const topPlatform = addPlatformObject(runtimeScene);
      topPlatform.setPosition(20, platform.getY() - object.getHeight());
      runtimeScene.renderAndStep(1000 / 60);

      // Ensure the object falls on the platform
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // try to grab the platform
      for (let i = 0; i < 30; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      }

      // The object is where it could grab the top platform if it was falling.
      expect(object.getX()).to.be.within(
        topPlatform.getX() - object.getWidth(),
        topPlatform.getX() - object.getWidth() + 2
      );
      expect(object.getY()).to.be(topPlatform.getY());
      // Check that the object didn't grabbed the platform
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(false);
    });
  });

  describe('(jumpthru)', function () {
    let runtimeScene;
    let object;
    let platform;
    let jumpthru;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object on a platform.
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 900,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 500,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);
      object.setPosition(0, -30);

      // Put a platform.
      platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);

      // Put a jump thru, higher than the platform so that the object jump from under it
      // and will land on it at the end of the jump.
      jumpthru = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj2',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformBehavior',
            name: 'Platform',
            canBeGrabbed: true,
            platformType: 'Jumpthru',
          },
        ],
        effects: [],
      });
      jumpthru.setCustomWidthAndHeight(60, 5);
      runtimeScene.addObject(jumpthru);
    });

    it('can jump through a jumpthru and land', function () {
      jumpthru.setPosition(0, -33);
      //Check the platform stopped the platformer object.
      for (let i = 0; i < 5; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Check that the jump starts properly, and is not stopped on the jumpthru
      object.getBehavior('auto1').simulateJumpKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-39, -38);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-47, -46);
      runtimeScene.renderAndStep(1000 / 60);
      // At this step, the object is almost on the jumpthru (-53 + 20 (object height) = -33 (jump thru Y position)),
      // but the object should not stop.
      expect(object.getY()).to.be.within(-54, -53);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-61, -60);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getY()).to.be.within(-67, -66);

      // Verify the object is still jumping
      expect(object.getBehavior('auto1').isJumping()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);

      // Continue the simulation and check that position is correct in the middle of the jump
      for (let i = 0; i < 20; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be.within(-89, -88);

      // Verify the object is now considered as falling in its jump:
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );

      // Continue simulation and check that we arrive on the jumpthru
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be.within(
        jumpthru.getY() - object.getHeight(),
        jumpthru.getY() - object.getHeight() + 1
      );
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
    });

    it('can jump right under a jumpthru without landing', function () {
      // A big one because the object jump to the right.
      jumpthru.setCustomWidthAndHeight(600, 20);
      const highestJumpY = -104; // actually -103.6
      // Right above the maximum reach by jumping
      jumpthru.setPosition(0, highestJumpY + object.getHeight());

      // The object landed on the platform.
      for (let i = 0; i < 5; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // The object jumps.
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 17; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
      }
      // The object is at the highest of the jump.
      expect(object.getY()).to.be.within(highestJumpY, highestJumpY + 1);

      // The object starts to fall.
      object.getBehavior('auto1').simulateRightKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );

      // The object still falls.
      for (let i = 0; i < 10; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
      }
      expect(object.getY()).to.be.above(-85);
    });

    it('can jump right above a jumpthru and landing', function () {
      // A big one because the object jump to the right.
      jumpthru.setCustomWidthAndHeight(600, 20);
      const highestJumpY = -104; // actually -103.6
      // Right above the maximum reach by jumping
      jumpthru.setPosition(0, highestJumpY + 1 + object.getHeight());

      // The object landed on the platform.
      for (let i = 0; i < 5; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // The object jumps.
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 17; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
      }
      // The object is at the highest of the jump.
      expect(object.getY()).to.be.within(highestJumpY, highestJumpY + 1);

      // The object landed on the jumpthru.
      object.getBehavior('auto1').simulateRightKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
        false
      );
      expect(object.getY()).to.be(jumpthru.getY() - object.getHeight());
    });

    it('can fall through the jumpthru from the left side', function () {
      jumpthru.setPosition(0, -33);
      object.setPosition(0, -100);
      jumpthru.setPosition(12, -90);
      jumpthru.setCustomWidthAndHeight(60, 100);

      // Check the jumpthru let the platformer object go through.
      for (let i = 0; i < 10; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          true
        );
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
      }
      // Overlapping the jumpthru
      expect(object.getX()).to.above(5);
      expect(object.getY()).to.be.within(-100, -80);
    });
  });

  describe('(moving platforms)', function () {
    let runtimeScene;
    let object;
    let platform;
    const maxSpeed = 500;
    const maxFallingSpeed = 1500;
    const timeDelta = 1 / 60;
    const maxDeltaX = maxSpeed * timeDelta;
    const maxDeltaY = maxFallingSpeed * timeDelta;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object on a platform.
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 900,
            maxFallingSpeed: maxFallingSpeed,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: maxSpeed,
            jumpSpeed: 1500,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);
      object.setPosition(0, -40);

      // Put a platform.
      platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);
    });

    it('follows a platform moving less than one pixel', function () {
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object has not moved.
      expect(object.getY()).to.be(-30);
      expect(object.getX()).to.be(0);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Check that the object follow the platform, even if the
      // movement is less than one pixel.
      platform.setX(platform.getX() + 0.12);
      runtimeScene.renderAndStep(1000 / 60);
      platform.setX(platform.getX() + 0.12);
      runtimeScene.renderAndStep(1000 / 60);
      platform.setX(platform.getX() + 0.12);
      runtimeScene.renderAndStep(1000 / 60);

      expect(object.getX()).to.be(0.36);
    });

    it('falls from a platform moving down faster than the maximum falling speed', function () {
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      // Check the object has not moved.
      expect(object.getY()).to.be(-30);
      expect(object.getX()).to.be(0);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // Check that the object falls
      // +1 because it's the margin to check the floor
      platform.setY(platform.getY() + maxDeltaY + 1);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(false);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isMoving()).to.be(true);
      expect(object.getY()).to.be.above(-30);
    });

    // This test doesn't pass because the platform AABB are not always updated
    // before the platformer object moves.
    //
    // When the character is put on top of the platform to follow it up,
    // the platform AABB may not has updated in RBush
    // and the platform became out of the spacial search rectangle.
    it.skip('follows a platform that is slightly overlapping its top', function () {
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      // Check the object has not moved.
      expect(object.getY()).to.be(-30);
      expect(object.getX()).to.be(0);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // the platform is slightly overlapping the top of the object
      platform.setY(object.getY() - platform.getHeight() + 1);
      runtimeScene.renderAndStep(1000 / 60);
      // Check that the object stays on the floor
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);
      expect(object.getY()).to.be(platform.getY() - object.getHeight());
    });

    it('must not follow a platform that is moved over its top', function () {
      for (let i = 0; i < 10; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }

      // Check the object has not moved.
      expect(object.getY()).to.be(-30);
      expect(object.getX()).to.be(0);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);

      // move the platform over the object
      platform.setY(object.getY() - platform.getHeight());
      runtimeScene.renderAndStep(1000 / 60);
      // A second step to make sure that the AABB is updated in RBush.
      // TODO this is a bug
      runtimeScene.renderAndStep(1000 / 60);
      // Check that the object falls
      expect(object.getBehavior('auto1').isOnFloor()).to.be(false);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getY()).to.be.above(-30);
    });

    it('follows a moving platform when was grabbed to another', function () {
      const topPlatform = addPlatformObject(runtimeScene);
      topPlatform.setPosition(platform.getX() + 30, -50);

      // Fall and Grab the platform
      object.setPosition(
        topPlatform.getX() - object.getWidth(),
        topPlatform.getY() - 10
      );

      for (let i = 0; i < 9; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          true
        );
      }
      object.getBehavior('auto1').simulateRightKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(true);

      // move the bottom platform to the object
      for (let i = 0; i < 20; ++i) {
        platform.setY(platform.getY() - 1);
        runtimeScene.renderAndStep(1000 / 60);
      }
      // the platform reach the object
      expect(platform.getY()).to.be(object.getY() + object.getHeight());
      for (let i = 0; i < 5; ++i) {
        platform.setY(platform.getY() - 1);
        runtimeScene.renderAndStep(1000 / 60);
      }
      // the object follows it and no longer grab the other platform
      expect(object.getY()).to.be(platform.getY() - object.getHeight());
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(false);
    });

    // This may be a bug. Please, remove the skip if you fixed it.
    // It fails on the last 2 expect()
    it.skip('follows a moving platform when was grabbed to a ladder', function () {
      // object is 10 pixel higher than the platform and overlap the ladder
      object.setPosition(0, platform.getY() - object.getHeight() - 10);
      const ladder = addLadderObject(runtimeScene);
      ladder.setPosition(object.getX(), platform.getY() - ladder.getHeight());

      // Fall and Grab the platform
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);
      object.getBehavior('auto1').simulateLadderKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isOnLadder()).to.be(true);

      // move the bottom platform to the object
      for (let i = 0; i < 20; ++i) {
        platform.setY(platform.getY() - 1);
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
      }
      // the platform reach the object
      expect(platform.getY()).to.be(object.getY() + object.getHeight());
      for (let i = 0; i < 5; ++i) {
        platform.setY(platform.getY() - 1);
        runtimeScene.renderAndStep(1000 / 60);
      }
      // the object follows it and no longer grab the other platform
      expect(object.getY()).to.be(platform.getY() - object.getHeight());
      expect(object.getBehavior('auto1').isOnLadder()).to.be(false);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
    });

    [-10, -10.1, -9.9].forEach((platformY) => {
      [
        -maxDeltaY + epsilon,
        maxDeltaY - epsilon,
        -10,
        10,
        -10.1,
        10.1,
        0,
      ].forEach((deltaY) => {
        [-maxDeltaX, maxDeltaX, 0].forEach((deltaX) => {
          it(`follows the platform moving (${deltaX}; ${deltaY}) with initial Y = ${platformY}`, function () {
            platform.setPosition(platform.getX(), platformY);
            for (let i = 0; i < 10; ++i) {
              runtimeScene.renderAndStep(1000 / 60);
            }
            // Check the object has not moved.
            expect(object.getX()).to.be(0);
            // The object landed right on the platform
            expect(object.getY()).to.be(platform.getY() - object.getHeight());
            expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
            expect(object.getBehavior('auto1').isFalling()).to.be(false);
            expect(object.getBehavior('auto1').isMoving()).to.be(false);

            // Check that the object follow the platform, even if the
            // movement is less than one pixel.
            for (let i = 0; i < 5; ++i) {
              platform.setPosition(
                platform.getX() + deltaX,
                platform.getY() + deltaY
              );
              runtimeScene.renderAndStep(1000 / 60);
              expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
              expect(object.getBehavior('auto1').isFalling()).to.be(false);
              expect(object.getBehavior('auto1').isMoving()).to.be(false);
              // The object follow the platform
              // The rounding error is probably due to a separate call.
              // TODO Try to make it exact or find why
              expect(object.getY()).to.be.within(
                platform.getY() - object.getHeight() - epsilon,
                platform.getY() - object.getHeight() + epsilon
              );
            }
            expect(object.getX()).to.be(0 + 5 * deltaX);
          });
        });
      });
    });
  });

  [false, true].forEach((useJumpthru) => {
    describe(`(${
      useJumpthru ? 'useJumpthru' : 'regular'
    } moving platforms)`, function () {
      let runtimeScene;
      let object;
      let platform;
      const maxSpeed = 500;
      const maxFallingSpeed = 1500;
      const timeDelta = 1 / 60;
      const maxDeltaX = maxSpeed * timeDelta;
      const maxDeltaY = maxFallingSpeed * timeDelta;

      beforeEach(function () {
        runtimeScene = makeTestRuntimeScene();

        // Put a platformer object on a platform.
        object = new gdjs.TestRuntimeObject(runtimeScene, {
          name: 'obj1',
          type: '',
          behaviors: [
            {
              type: 'PlatformBehavior::PlatformerObjectBehavior',
              name: 'auto1',
              gravity: 900,
              maxFallingSpeed: maxFallingSpeed,
              acceleration: 500,
              deceleration: 1500,
              maxSpeed: maxSpeed,
              jumpSpeed: 1500,
              canGrabPlatforms: true,
              ignoreDefaultControls: true,
              slopeMaxAngle: 60,
            },
          ],
          effects: [],
        });
        object.setCustomWidthAndHeight(10, 20);
        runtimeScene.addObject(object);
        object.setPosition(0, -40);

        // Put a platform.
        if (useJumpthru) {
          platform = addJumpThroughPlatformObject(runtimeScene);
        } else {
          platform = addPlatformObject(runtimeScene);
        }
        platform.setPosition(0, -10);
      });

      // This test doesn't pass with jumpthru
      // because jumpthru that overlap the object are excluded from collision.
      // The probability it happens is: platform speed / falling speed.
      // We could use the Y speed to be more permissive about it:
      // If the previous position according to the speed is above the platform,
      // we could let it land.
      it.skip('can land to a platform that moved up and overlapped the object', function () {
        // Put the platform away so it won't collide with the falling object
        platform.setPosition(platform.getX(), 200);

        for (let i = 0; i < 10; ++i) {
          const oldY = object.getY();
          runtimeScene.renderAndStep(1000 / 60);
        }
        // Put the platform under the falling object and overlap it a little
        // like a platform moving quickly can do
        platform.setPosition(
          platform.getX(),
          object.getY() + object.getHeight() - 2
        );
        runtimeScene.renderAndStep(1000 / 60);

        // Check the object has landed on the platform.
        expect(object.getX()).to.be(0);
        // The object must not be inside the platform or it gets stuck
        expect(object.getY()).to.be.within(
          platform.getY() - object.getHeight() - epsilon,
          platform.getY() - object.getHeight() + epsilon
        );
        expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isMoving()).to.be(false);
      });

      [-10, -10.1, -9.9].forEach((platformY) => {
        [
          -maxDeltaY + epsilon,
          maxDeltaY - epsilon,
          -10,
          10,
          -10.1,
          10.1,
          0,
        ].forEach((deltaY) => {
          [-maxDeltaX, maxDeltaX, 0].forEach((deltaX) => {
            it(`follows the platform moving (${deltaX}; ${deltaY}) with initial Y = ${platformY}`, function () {
              platform.setPosition(platform.getX(), platformY);
              for (let i = 0; i < 10; ++i) {
                runtimeScene.renderAndStep(1000 / 60);
              }
              // Check the object has not moved.
              expect(object.getX()).to.be(0);
              // The object must not be inside the platform or it gets stuck
              expect(object.getY()).to.be.within(
                platform.getY() - object.getHeight() - epsilon,
                platform.getY() - object.getHeight() + epsilon
              );
              expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
              expect(object.getBehavior('auto1').isFalling()).to.be(false);
              expect(object.getBehavior('auto1').isMoving()).to.be(false);

              // Check that the object follow the platform, even if the
              // movement is less than one pixel.
              for (let i = 0; i < 5; ++i) {
                platform.setPosition(
                  platform.getX() + deltaX,
                  platform.getY() + deltaY
                );
                runtimeScene.renderAndStep(1000 / 60);
                expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
                expect(object.getBehavior('auto1').isFalling()).to.be(false);
                expect(object.getBehavior('auto1').isMoving()).to.be(false);
                // The object must not be inside the platform or it gets stuck
                expect(object.getY()).to.be.within(
                  platform.getY() - object.getHeight() - epsilon,
                  platform.getY() - object.getHeight() + epsilon
                );
              }
              expect(object.getX()).to.be(0 + 5 * deltaX);
            });
          });
        });
      });
    });
  });

  describe('and gdjs.PlatformRuntimeBehavior at same time', function () {
    let runtimeScene;
    let object;
    let platform;
    var object2;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object on a platform.
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'PlatformerObject',
            gravity: 900,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 500,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);
      object.setPosition(0, -30);

      // Put a platform.
      platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);

      // Put a platformer object that is also a platform itself.
      object2 = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj2',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'PlatformerObject',
            gravity: 900,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 500,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
          },
          {
            type: 'PlatformBehavior::PlatformBehavior',
            name: 'Platform',
            canBeGrabbed: true,
            platformType: 'Platform',
          },
        ],
        effects: [],
      });
      object2.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object2);

      // Position it above the other platformer object and just on its right,
      // but one pixel too much so that the first platformer object will be moved
      // left by 1px when the second platformer object+platform falls.
      object2.setPosition(9, -60);
    });

    it('can jump through the jumpthru', function () {
      // Check that the second object falls (it's not stopped by itself)
      expect(object2.getY()).to.be(-60);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object2.getY()).to.be(-59.75);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object2.getY()).to.be(-59.25);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object2.getY()).to.be(-58.5);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object2.getY()).to.be(-57.5);

      //Check the first object stays on the platform.
      expect(object.getY()).to.be(-30);

      // Simulate more frames. Check that trying to jump won't do anything.
      for (let i = 0; i < 5; ++i) {
        object2.getBehavior('PlatformerObject').simulateJumpKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object2.getY()).to.be(-48.75);
      expect(object.getX()).to.be(0);
      expect(object.getY()).to.be(-30);

      // Verify that the first platformer object is moved 1px to the left
      // as the falling platformer object+platform collides with it
      runtimeScene.renderAndStep(1000 / 60);
      expect(object2.getY()).to.be(-46.25);
      expect(object.getX()).to.be(-1);
      expect(object.getY()).to.be(-30);

      // Simulate more frames so that the object reaches the floor
      for (let i = 0; i < 20; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object2.getX()).to.be(9);
      expect(object2.getY()).to.be(-30);
      expect(object.getX()).to.be(-1);
      expect(object.getY()).to.be(-30);

      // Start a jump for both objects
      object.getBehavior('PlatformerObject').simulateJumpKey();
      object2.getBehavior('PlatformerObject').simulateJumpKey();
      for (let i = 0; i < 6; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object2.getX()).to.be(9);
      expect(object2.getY()).to.be(-72.5);
      expect(object.getX()).to.be(-1);
      expect(object.getY()).to.be(-72.5);

      // Try to go right for the first object: won't work because the other
      // object is a platform.
      for (let i = 0; i < 5; ++i) {
        object.getBehavior('PlatformerObject').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object2.getX()).to.be(9);
      expect(object2.getY()).to.be.within(-94.2, -94.1);
      expect(object.getX()).to.be(-1);
      expect(object.getY()).to.be.within(-94.2, -94.1);

      // Try to go right for the first and second object: can do.
      for (let i = 0; i < 3; ++i) {
        object.getBehavior('PlatformerObject').simulateRightKey();
        object2.getBehavior('PlatformerObject').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object2.getX()).to.be.within(9.83, 9.84);
      expect(object2.getY()).to.be.within(-101.2, -101.1);
      expect(object.getX()).to.be.within(-0.59, -0.58);
      expect(object.getY()).to.be.within(-101.2, -101.1);

      // Let the object fall back on the floor.
      for (let i = 0; i < 30; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object2.getX()).to.be.within(9.83, 9.84);
      expect(object2.getY()).to.be(-30);
      expect(object.getX()).to.be.within(-0.59, -0.58);
      expect(object.getY()).to.be(-30);
    });
  });

  describe('(ladder)', function () {
    let runtimeScene;
    let object;
    var scale;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object on a platform
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 1500,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 900,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
            jumpSustainTime: 0.2,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);

      // Put a platform.
      const platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);

      ladder = addLadderObject(runtimeScene);
      ladder.setPosition(30, -10 - ladder.getHeight());
    });

    const fall = (frameCount) => {
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
        expect(object.getY()).to.be.above(lastY);
      }
    };

    const climbLadder = (frameCount) => {
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        object.getBehavior('auto1').simulateUpKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
        expect(object.getY()).to.be.below(lastY);
      }
    };

    const releaseLadder = (frameCount) => {
      object.getBehavior('auto1').simulateReleaseLadderKey();
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnLadder()).to.be(false);
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
        expect(object.getY()).to.be.above(lastY);
      }
    };

    const stayOnLadder = (frameCount) => {
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
        expect(object.getBehavior('auto1').isMoving()).to.be(false);
        expect(object.getY()).to.be(lastY);
      }
    };

    const jumpAndAscend = (frameCount) => {
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
        expect(object.getY()).to.be.below(lastY);
      }
    };
    const jumpAndDescend = (frameCount) => {
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isJumping()).to.be(true);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          false
        );
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
        expect(object.getY()).to.be.above(lastY);
      }
    };

    const fallOnPlatform = (maxFrameCount) => {
      // Ensure the object falls on the platform
      for (let i = 0; i < maxFrameCount; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      //Check the object is on the platform
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);
    };

    it('can climb and release a ladder', function () {
      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Climb the ladder
      object.getBehavior('auto1').simulateLadderKey();
      climbLadder(10);
      stayOnLadder(10);
      const objectPositionAfterFirstClimb = object.getY();
      releaseLadder(10);
      object.getBehavior('auto1').simulateLadderKey();
      expect(object.getY()).to.be.within(
        // gravity is 1500, 10 frames falling ~ 23px
        objectPositionAfterFirstClimb + 22,
        objectPositionAfterFirstClimb + 24
      );
      climbLadder(24);
      // Check that we reached the maximum height
      const playerAtLadderTop = ladder.getY() - object.getHeight();
      expect(object.getY()).to.be.within(
        playerAtLadderTop - 3,
        playerAtLadderTop
      );

      // The player goes a little over the ladder...
      object.getBehavior('auto1').simulateUpKey();
      // ...and it falls even if up is pressed
      for (let i = 0; i < 13; ++i) {
        object.getBehavior('auto1').simulateUpKey();
        fall(1);
      }
    });

    it('can jump and grab a ladder even on the ascending phase of a jump the 1st time', function () {
      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Jump
      object.getBehavior('auto1').simulateJumpKey();
      runtimeScene.renderAndStep(1000 / 60);
      for (let i = 0; i < 2; ++i) {
        object.getBehavior('auto1').simulateUpKey();
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be.below(-30);
      expect(object.getBehavior('auto1').isJumping()).to.be(true);

      // Grab the ladder
      object.getBehavior('auto1').simulateLadderKey();
      runtimeScene.renderAndStep(1000 / 60);

      stayOnLadder(10);
      climbLadder(2);
    });

    it('can grab a ladder while on the descending phase of a jump', function () {
      // Need a bigger ladder
      ladder.getHeight = function () {
        return 300;
      };
      ladder.setPosition(30, -10 - ladder.getHeight());

      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Jump
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 19; ++i) {
        jumpAndAscend(1);
      }

      // starting to going down
      object.getBehavior('auto1').simulateLadderKey();
      stayOnLadder(1);
      expect(object.getBehavior('auto1').isJumping()).to.be(false);

      stayOnLadder(10);
      climbLadder(2);
    });

    it('can jump from ladder to ladder', function () {
      // Need a bigger ladder
      ladder.getHeight = function () {
        return 300;
      };
      ladder.setPosition(30, -10 - ladder.getHeight());

      const ladder2 = addLadderObject(runtimeScene);
      ladder2.getHeight = function () {
        return 300;
      };
      ladder2.setPosition(ladder.getX() + ladder.getWidth(), ladder.getY());

      object.setPosition(35, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Jump
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 10; ++i) {
        jumpAndAscend(1);
      }

      // 1st time grabbing this ladder
      object.getBehavior('auto1').simulateLadderKey();
      stayOnLadder(1);
      expect(object.getBehavior('auto1').isJumping()).to.be(false);

      // Jump right
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 15; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        jumpAndAscend(1);
      }
      // leave the 1st ladder
      expect(object.getX()).to.be.above(ladder2.getX());
      // and grab the 2nd one, even if still ascending
      object.getBehavior('auto1').simulateLadderKey();
      // still moves a little because of inertia
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
      stayOnLadder(1);
    });

    it('can fall from a ladder right side', function () {
      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Climb the ladder
      object.getBehavior('auto1').simulateLadderKey();
      climbLadder(10);
      stayOnLadder(10);

      // Fall to the ladder right
      runtimeScene.renderAndStep(1000 / 60);
      for (let i = 0; i < 16; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
      }
      fall(5);
    });

    it('can walk from a ladder', function () {
      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Climb the ladder
      object.getBehavior('auto1').simulateLadderKey();
      stayOnLadder(10);

      // Going from the ladder to the right
      runtimeScene.renderAndStep(1000 / 60);
      for (let i = 0; i < 16; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
      }
      // and directly on the floor
      object.getBehavior('auto1').simulateRightKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
    });

    it('can jump from a ladder', function () {
      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Climb the ladder
      object.getBehavior('auto1').simulateLadderKey();
      climbLadder(10);
      stayOnLadder(10);

      // Jump from the ladder
      const stayY = object.getY();
      object.getBehavior('auto1').simulateJumpKey();
      for (let i = 0; i < 20; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      expect(object.getY()).to.be.below(stayY);
      expect(object.getBehavior('auto1').isJumping()).to.be(true);
    });

    it('can grab a ladder when falling', function () {
      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);

      // Climb the ladder
      object.getBehavior('auto1').simulateLadderKey();
      climbLadder(24);
      // Check that we reached the maximum height
      // The player goes a little over the ladder...
      object.getBehavior('auto1').simulateUpKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isFalling()).to.be(true);
      expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(true);
      fall(10);

      object.getBehavior('auto1').simulateLadderKey();
      stayOnLadder(10);
      climbLadder(5);
    });

    it('should not grab a platform when grabbed to a ladder', function () {
      const topPlatform = addPlatformObject(runtimeScene);
      topPlatform.setPosition(ladder.getX() + ladder.getWidth(), -50);
      runtimeScene.renderAndStep(1000 / 60);

      object.setPosition(
        topPlatform.getX() - object.getWidth(),
        topPlatform.getY()
      );
      // Grab the ladder
      object.getBehavior('auto1').simulateLadderKey();
      stayOnLadder(10);

      object.getBehavior('auto1').simulateRightKey();
      runtimeScene.renderAndStep(1000 / 60);
      // The object is where it could grab the top platform if it where falling.
      expect(object.getX()).to.be.within(
        topPlatform.getX() - object.getWidth(),
        topPlatform.getX() - object.getWidth() + 2
      );
      expect(object.getY()).to.be(topPlatform.getY());
      // Check that the object didn't grabbed the platform
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(false);

      stayOnLadder(10);
    });

    it('can grab a ladder when grabbed to a platform', function () {
      const topPlatform = addPlatformObject(runtimeScene);
      topPlatform.setPosition(ladder.getX() + ladder.getWidth(), -50);
      runtimeScene.renderAndStep(1000 / 60);

      // Fall and Grab the platform
      object.setPosition(
        topPlatform.getX() - object.getWidth(),
        topPlatform.getY() - 10
      );
      for (let i = 0; i < 6; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        fall(1);
      }
      object.getBehavior('auto1').simulateRightKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(true);

      // try to grab the ladder
      object.getBehavior('auto1').simulateLadderKey();
      runtimeScene.renderAndStep(1000 / 60);
      expect(object.getBehavior('auto1').isOnLadder()).to.be(true);
      expect(object.getBehavior('auto1').isGrabbingPlatform()).to.be(false);
    });
  });

  [0, 60].forEach((slopeMaxAngle) => {
    describe(`(walk on flat floors, slopeMaxAngle: ${slopeMaxAngle}°)`, function () {
      let runtimeScene;
      let object;

      beforeEach(function () {
        runtimeScene = makeTestRuntimeScene();

        // Put a platformer object on a platform
        object = new gdjs.TestRuntimeObject(runtimeScene, {
          name: 'obj1',
          type: '',
          behaviors: [
            {
              type: 'PlatformBehavior::PlatformerObjectBehavior',
              name: 'auto1',
              gravity: 1500,
              maxFallingSpeed: 1500,
              acceleration: 500,
              deceleration: 1500,
              maxSpeed: 500,
              jumpSpeed: 900,
              canGrabPlatforms: true,
              ignoreDefaultControls: true,
              slopeMaxAngle: slopeMaxAngle,
              jumpSustainTime: 0.2,
            },
          ],
          effects: [],
        });
        object.setCustomWidthAndHeight(10, 20);
        runtimeScene.addObject(object);
      });

      const fall = (frameCount) => {
        for (let i = 0; i < frameCount; ++i) {
          const lastY = object.getY();
          runtimeScene.renderAndStep(1000 / 60);
          expect(object.getBehavior('auto1').isFalling()).to.be(true);
          expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
            true
          );
          expect(object.getBehavior('auto1').isMoving()).to.be(true);
          expect(object.getY()).to.be.above(lastY);
        }
      };

      const walkRight = (frameCount) => {
        const behavior = object.getBehavior('auto1');
        for (let i = 0; i < frameCount; ++i) {
          const lastX = object.getX();
          const lastSpeed = behavior.getCurrentSpeed();
          behavior.simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(behavior.isOnFloor()).to.be(true);
          expect(object.getX()).to.be.above(lastX);
          // Check that the object doesn't stop
          expect(behavior.getCurrentSpeed()).to.be.above(lastSpeed);
        }
      };

      const fallOnPlatform = (maxFrameCount) => {
        // Ensure the object falls on the platform
        for (let i = 0; i < maxFrameCount; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
        }
        //Check the object is on the platform
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isMoving()).to.be(false);
      };

      const slopesDimensions = {
        26: { width: 50, height: 25 },
        45: { width: 50, height: 50 },
      };

      it('can walk from a platform to another one', function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
        const platform2 = addPlatformObject(runtimeScene);
        platform2.setPosition(
          platform.getX() + platform.getWidth(),
          platform.getY()
        );

        object.setPosition(30, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // Walk from the 1st platform to the 2nd one.
        walkRight(30);
        expect(object.getX()).to.be.above(platform2.getX());
        expect(object.getY()).to.be(platform2.getY() - object.getHeight());
      });

      it('can walk from a platform to a jump through', function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
        const jumpThroughPlatform = addJumpThroughPlatformObject(runtimeScene);
        jumpThroughPlatform.setPosition(
          platform.getX() + platform.getWidth(),
          platform.getY()
        );

        object.setPosition(30, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // Walk from the 1st platform to the 2nd one.
        walkRight(30);
        expect(object.getX()).to.be.above(jumpThroughPlatform.getX());
        expect(object.getY()).to.be(
          jumpThroughPlatform.getY() - object.getHeight()
        );
      });

      it('can walk on a platform and go through a jump through', function () {
        // Jumpthru that are ignored had a side effects on the search context.
        // It made jumpthru appear solid when a platform was tested after them.

        // Add the jumptru 1st to make RBrush gives it 1st.
        // There is no causality but it does in the current implementation.
        const jumpThroughPlatform = addJumpThroughPlatformObject(runtimeScene);
        jumpThroughPlatform.setPosition(30, -15);
        jumpThroughPlatform.setCustomWidthAndHeight(60, 10);

        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);

        object.setPosition(10, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // Walk from the 1st platform to the 2nd one.
        walkRight(20);
        expect(object.getX()).to.be.above(jumpThroughPlatform.getX());
        expect(object.getY()).to.be(platform.getY() - object.getHeight());
      });

      it('can walk from a platform to another one that not aligned', function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
        const platform2 = addPlatformObject(runtimeScene);
        platform2.setPosition(
          platform.getX() + platform.getWidth(),
          // the 2nd platform is 1 pixel higher
          platform.getY() - 1
        );

        object.setPosition(30, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // Walk from the 1st platform to the 2nd one.
        walkRight(30);
        expect(object.getX()).to.be.above(platform2.getX());
        expect(object.getY()).to.be(platform2.getY() - object.getHeight());
      });

      it('can walk from a platform to another one with a speed under 1 pixel/second', function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
        const platform2 = addPlatformObject(runtimeScene);
        platform2.setPosition(
          platform.getX() + platform.getWidth(),
          // The 2nd platform is 1 pixels higher.
          platform.getY() - 1
        );
        // Put the object just to the left of platform2 so that
        // it try climbing on it with a very small speed.
        object.setPosition(platform2.getX() - object.getWidth(), -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // Walk from the 1st platform to the 2nd one.
        walkRight(30);
        expect(object.getX()).to.be.above(platform2.getX());
        expect(object.getY()).to.be(platform2.getY() - object.getHeight());
      });

      it("can't walk from a platform to another one that is a bit too high", function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
        const platform2 = addPlatformObject(runtimeScene);
        platform2.setPosition(
          platform.getX() + platform.getWidth(),
          // The 2nd platform is 2 pixels higher.
          platform.getY() - 2
        );

        object.setPosition(30, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // walk right
        for (let i = 0; i < 20; ++i) {
          object.getBehavior('auto1').simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
        }
        // is blocked by the 2nd platform
        expect(object.getX()).to.be(platform2.getX() - object.getWidth());
        expect(object.getY()).to.be(platform.getY() - object.getHeight());
      });

      it('can walk on a platform and be blocked by a wall', function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
        // the 2nd platform is 2 pixels higher
        const platform2 = addPlatformObject(runtimeScene);
        platform2.setPosition(
          platform.getX() + platform.getWidth(),
          // The platform's top is over the object
          // and platform's bottom is under the object.
          platform.getY() - platform2.getHeight() + 5
        );

        object.setPosition(30, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // walk right
        for (let i = 0; i < 20; ++i) {
          object.getBehavior('auto1').simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
        }
        // is blocked by the 2nd platform
        expect(object.getX()).to.be(platform2.getX() - object.getWidth());
        expect(object.getY()).to.be(platform.getY() - object.getHeight());
      });

      it('can walk from a platform and fell through a jump through that is at the right but 1 pixel higher', function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setPosition(0, -10);
        const jumpThroughPlatform = addJumpThroughPlatformObject(runtimeScene);
        jumpThroughPlatform.setPosition(
          platform.getX() + platform.getWidth(),
          // Even 1 pixel is too high to follow a jump through
          // because it's like it's gone through its right or left side.
          platform.getY() - 1
        );

        object.setPosition(30, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

        // Walk right
        for (let i = 0; i < 20; ++i) {
          object.getBehavior('auto1').simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
        }
        // Fall under the jump through platform
        for (let i = 0; i < 11; ++i) {
          object.getBehavior('auto1').simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(object.getBehavior('auto1').isFalling()).to.be(true);
        }
        expect(object.getY()).to.be.above(platform.getY());
      });

      it('can walk inside a tunnel platform', function () {
        // Put a platform.
        const platform = addTunnelPlatformObject(runtimeScene);
        platform.setPosition(0, 0);

        object.setPosition(0, 160);
        // The object falls on the bottom part of the platform
        fallOnPlatform(10);
        expect(object.getY()).to.be(200 - object.getHeight());

        // The object walk on the bottom part of the platform.
        walkRight(30);
        expect(object.getX()).to.be.above(60);
        expect(object.getY()).to.be(200 - object.getHeight());
      });
    });
  });

  describe('(walk on slopes)', function () {
    let runtimeScene;
    let object;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object on a platform
      object = new gdjs.TestRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 1500,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 900,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
            jumpSustainTime: 0.2,
          },
        ],
        effects: [],
      });
      object.setCustomWidthAndHeight(10, 20);
      runtimeScene.addObject(object);
    });

    const fall = (frameCount) => {
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          true
        );
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
        expect(object.getY()).to.be.above(lastY);
      }
    };

    const walkRight = (frameCount) => {
      const behavior = object.getBehavior('auto1');
      for (let i = 0; i < frameCount; ++i) {
        const lastX = object.getX();
        const lastSpeed = behavior.getCurrentSpeed();
        behavior.simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(behavior.isOnFloor()).to.be(true);
        expect(object.getX()).to.be.above(lastX);
        // Check that the object doesn't stop
        expect(behavior.getCurrentSpeed()).to.be.above(lastSpeed);
      }
    };

    const walkRightCanStop = (frameCount) => {
      const behavior = object.getBehavior('auto1');
      for (let i = 0; i < frameCount; ++i) {
        const lastX = object.getX();
        const lastSpeed = behavior.getCurrentSpeed();
        behavior.simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(behavior.isOnFloor()).to.be(true);
        expect(object.getX()).to.not.be.below(lastX);
      }
    };

    const walkLeft = (frameCount) => {
      const behavior = object.getBehavior('auto1');
      for (let i = 0; i < frameCount; ++i) {
        const lastX = object.getX();
        const lastSpeed = behavior.getCurrentSpeed();
        behavior.simulateLeftKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(behavior.isOnFloor()).to.be(true);
        expect(object.getX()).to.be.below(lastX);
        // Check that the object doesn't stop
        expect(behavior.getCurrentSpeed()).to.be.below(lastSpeed);
      }
    };

    const fallOnPlatform = (maxFrameCount) => {
      // Ensure the object falls on the platform
      for (let i = 0; i < maxFrameCount; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      //Check the object is on the platform
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);
    };

    const slopesDimensions = {
      26: { width: 50, height: 25 },
      45: { width: 50, height: 50 },
    };

    it('can walk from a platform to another one that is rotated', function () {
      // Put a platform.
      const platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);

      const platform2 = addPlatformObject(runtimeScene);

      const angle = (-30 * Math.PI) / 180;
      const centerDeltaX = platform2.getWidth() / 2;
      const centerDeltaY = platform2.getHeight() / 2;
      // to make the vertex of the 2 platform touch
      const vertexDeltaX =
        centerDeltaX * Math.cos(angle) +
        centerDeltaY * -Math.sin(angle) -
        centerDeltaX;
      const vertexDeltaY =
        centerDeltaX * Math.sin(angle) +
        centerDeltaY * Math.cos(angle) -
        centerDeltaY;

      platform2.setAngle(-30);
      platform2.setPosition(
        platform.getX() + platform.getWidth() + vertexDeltaX,
        platform.getY() + vertexDeltaY
      );

      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

      // Walk from the 1st platform to the 2nd one.
      walkRight(30);
      expect(object.getX()).to.be.above(platform2.getX());
      // Gone upward following the 2nd platform.
      expect(object.getY()).to.be.below(platform.getY());
    });

    [26, 45].forEach((slopeAngle) => {
      it(`can go uphill from a 0° slope to a ${slopeAngle}° slope going right`, function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setCustomWidthAndHeight(50, 50);
        platform.setPosition(0, 0);

        const slope = addUpSlopePlatformObject(runtimeScene);
        slope.setCustomWidthAndHeight(
          slopesDimensions[slopeAngle].width,
          slopesDimensions[slopeAngle].height
        );
        slope.setPosition(
          platform.getX() + platform.getWidth(),
          platform.getY() - slope.getHeight()
        );

        object.setPosition(0, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);

        // Walk from the 1st platform to the 2nd one.
        walkRight(30);
        expect(object.getX()).to.be.above(slope.getX());
        // Gone upward following the 2nd platform.
        expect(object.getY()).to.be.below(platform.getY() - object.getHeight());
      });

      // This is a mirror of the previous test.
      it(`can go uphill from a 0° slope to a ${slopeAngle}° slope going left`, function () {
        // Put a platform.
        const platform = addPlatformObject(runtimeScene);
        platform.setCustomWidthAndHeight(50, 50);
        platform.setPosition(50, 0);

        const slope = addDownSlopePlatformObject(runtimeScene);
        slope.setCustomWidthAndHeight(
          slopesDimensions[slopeAngle].width,
          slopesDimensions[slopeAngle].height
        );
        slope.setPosition(
          platform.getX() - slope.getWidth(),
          platform.getY() - slope.getHeight()
        );

        object.setPosition(90, -32);
        // Ensure the object falls on the platform
        fallOnPlatform(10);

        // Walk from the 1st platform to the 2nd one.
        walkLeft(30);
        expect(object.getX()).to.be.below(platform.getX());
        // Gone upward following the 2nd platform.
        expect(object.getY()).to.be.below(platform.getY() - object.getHeight());
      });

      it(`can go uphill from a ${slopeAngle}° slope to a 0° slope`, function () {
        // Put a platform.
        const slope = addUpSlopePlatformObject(runtimeScene);
        slope.setCustomWidthAndHeight(
          slopesDimensions[slopeAngle].width,
          slopesDimensions[slopeAngle].height
        );
        slope.setPosition(0, 0);

        const platform = addPlatformObject(runtimeScene);
        platform.setCustomWidthAndHeight(50, 50);
        platform.setPosition(slope.getX() + slope.getWidth(), slope.getY());

        object.setPosition(0, -5);
        // Ensure the object falls on the platform
        fallOnPlatform(12);

        // Walk from the 1st platform to the 2nd one.
        walkRight(30);
        expect(object.getX()).to.be.above(platform.getX());
        // Gone upward following the 2nd platform.
        expect(object.getY()).to.be(platform.getY() - object.getHeight());
      });

      it(`can go uphill from a ${slopeAngle}° slope to a 0° jump through platform`, function () {
        // Put a platform.
        const slope = addUpSlopePlatformObject(runtimeScene);
        slope.setCustomWidthAndHeight(
          slopesDimensions[slopeAngle].width,
          slopesDimensions[slopeAngle].height
        );
        slope.setPosition(0, 0);

        const jumpThroughPlatform = addJumpThroughPlatformObject(runtimeScene);
        jumpThroughPlatform.setCustomWidthAndHeight(50, 50);
        jumpThroughPlatform.setPosition(
          slope.getX() + slope.getWidth(),
          slope.getY()
        );

        object.setPosition(0, -5);
        // Ensure the object falls on the platform
        fallOnPlatform(12);

        // Walk from the 1st platform to the 2nd one.
        walkRight(30);
        expect(object.getX()).to.be.above(jumpThroughPlatform.getX());
        // Gone upward following the 2nd platform.
        expect(object.getY()).to.be(
          jumpThroughPlatform.getY() - object.getHeight()
        );
      });

      [
        [26, 45],
        [45, 26],
        [26, 26],
        [45, 45],
      ].forEach((slopeAngles) => {
        it(`can go uphill from a ${slopeAngles[0]}° slope to a ${slopeAngles[1]}° slope`, function () {
          // Put a platform.
          const slope1 = addUpSlopePlatformObject(runtimeScene);
          slope1.setCustomWidthAndHeight(
            slopesDimensions[slopeAngles[0]].width,
            slopesDimensions[slopeAngles[0]].height
          );
          slope1.setPosition(0, 0);

          const slope2 = addUpSlopePlatformObject(runtimeScene);
          slope2.setCustomWidthAndHeight(
            slopesDimensions[slopeAngles[1]].width,
            slopesDimensions[slopeAngles[1]].height
          );
          slope2.setPosition(
            slope1.getX() + slope1.getWidth(),
            slope1.getY() - slope2.getHeight()
          );

          object.setPosition(0, -5);
          // Ensure the object falls on the platform
          fallOnPlatform(12);

          // Walk from the 1st platform to the 2nd one.
          walkRight(30);
          expect(object.getX()).to.be.above(slope2.getX());
          // Gone upward following the 2nd platform.
          expect(object.getY()).to.be.below(slope1.getY() - object.getHeight());
        });
      });

      // TODO
      it.skip(`can go uphill from a 26° slope and be stopped by an obstacle on the head`, function () {
        // Put a platform.
        const slope = addUpSlopePlatformObject(runtimeScene);
        slope.setCustomWidthAndHeight(100, 50);
        slope.setPosition(0, 0);

        const ceiling = addPlatformObject(runtimeScene);
        ceiling.setCustomWidthAndHeight(50, 50);
        ceiling.setPosition(
          50,
          slope.getY() - ceiling.getHeight() - object.getHeight() / 2
        );

        object.setPosition(0, -5);
        // Ensure the object falls on the platform
        fallOnPlatform(12);

        // Walk the slope and reach the ceiling.
        // It checks that the character never go left.
        walkRightCanStop(40);
        expect(object.getY()).to.be(ceiling.getY() + ceiling.getHeight());
      });

      [26, 45].forEach((slopeAngle) => {
        it(`can go downhill from a 0° slope to a ${slopeAngle}° slope`, function () {
          // Put a platform.
          const platform = addPlatformObject(runtimeScene);
          platform.setCustomWidthAndHeight(50, 50);
          platform.setPosition(0, 0);

          const slope = addDownSlopePlatformObject(runtimeScene);
          slope.setCustomWidthAndHeight(
            slopesDimensions[slopeAngle].width,
            slopesDimensions[slopeAngle].height
          );
          slope.setPosition(
            platform.getX() + platform.getWidth(),
            platform.getY()
          );

          object.setPosition(0, -32);
          // Ensure the object falls on the platform
          fallOnPlatform(10);

          // Walk from the 1st platform to the 2nd one.
          walkRight(30);
          expect(object.getX()).to.be.above(slope.getX());
          // Gone downward following the 2nd platform.
          expect(object.getY()).to.be.above(slope.getY() - object.getHeight());
        });

        it(`can go downhill from a ${slopeAngle}° slope to a 0° slope`, function () {
          // Put a platform.
          const slope = addDownSlopePlatformObject(runtimeScene);
          slope.setCustomWidthAndHeight(
            slopesDimensions[slopeAngle].width,
            slopesDimensions[slopeAngle].height
          );
          slope.setPosition(0, 0);

          const platform = addPlatformObject(runtimeScene);
          slope.setCustomWidthAndHeight(50, 50);
          platform.setPosition(
            slope.getX() + slope.getWidth(),
            slope.getY() + slope.getHeight()
          );

          object.setPosition(0, -32);
          // Ensure the object falls on the platform
          fallOnPlatform(10);

          // Walk from the 1st platform to the 2nd one.
          walkRight(30);
          expect(object.getX()).to.be.above(platform.getX());
          // Gone downward following the 2nd platform.
          expect(object.getY()).to.be(platform.getY() - object.getHeight());
        });
      });

      [
        [26, 45],
        [45, 26],
        [26, 26],
        [45, 45],
      ].forEach((slopeAngles) => {
        it(`can go downhill from a ${slopeAngles[0]}° slope to a ${slopeAngles[1]}° slope`, function () {
          // Put a platform.
          const slope1 = addDownSlopePlatformObject(runtimeScene);
          slope1.setCustomWidthAndHeight(
            slopesDimensions[slopeAngles[0]].width,
            slopesDimensions[slopeAngles[0]].height
          );
          slope1.setPosition(0, 0);

          const slope2 = addDownSlopePlatformObject(runtimeScene);
          slope2.setCustomWidthAndHeight(
            slopesDimensions[slopeAngles[1]].width,
            slopesDimensions[slopeAngles[1]].height
          );
          slope2.setPosition(
            slope1.getX() + slope1.getWidth(),
            slope1.getY() + slope1.getHeight()
          );

          object.setPosition(0, -32);
          // Ensure the object falls on the platform
          fallOnPlatform(11);

          // Walk from the 1st platform to the 2nd one.
          walkRight(30);
          expect(object.getX()).to.be.above(slope2.getX());
          // Gone downward following the 2nd platform.
          expect(object.getY()).to.be.above(slope2.getY() - object.getHeight());
        });
      });
    });

    describe('(walk on slopes very fast)', function () {
      let runtimeScene;
      let object;

      beforeEach(function () {
        runtimeScene = makeTestRuntimeScene();

        // Put a platformer object on a platform
        object = new gdjs.TestRuntimeObject(runtimeScene, {
          name: 'obj1',
          type: '',
          behaviors: [
            {
              type: 'PlatformBehavior::PlatformerObjectBehavior',
              name: 'auto1',
              gravity: 1500,
              maxFallingSpeed: 1500,
              acceleration: 100000,
              deceleration: 1500,
              // It will move more than 1 width every frame
              maxSpeed: 1000, // fps * width = 60 * 10 = 600 plus a big margin
              jumpSpeed: 900,
              canGrabPlatforms: true,
              ignoreDefaultControls: true,
              slopeMaxAngle: 60,
              jumpSustainTime: 0.2,
            },
          ],
          effects: [],
        });
        object.setCustomWidthAndHeight(10, 20);
        runtimeScene.addObject(object);
      });

      const walkRight = (frameCount) => {
        const behavior = object.getBehavior('auto1');
        for (let i = 0; i < frameCount; ++i) {
          const lastX = object.getX();
          const lastSpeed = behavior.getCurrentSpeed();
          behavior.simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(behavior.isOnFloor()).to.be(true);
          expect(object.getX()).to.be.above(lastX);
          // Check that the object doesn't stop
          expect(behavior.getCurrentSpeed()).to.not.be.below(lastSpeed);
        }
      };

      const fallOnPlatform = (maxFrameCount) => {
        // Ensure the object falls on the platform
        for (let i = 0; i < maxFrameCount; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
        }
        //Check the object is on the platform
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isMoving()).to.be(false);
      };

      // TODO When the object is moving fast, sharp platform vertices can be missed.
      // Fixing this is would require to rethink how the floor is followed.
      // But, this might be an extreme enough case to don't care:
      // On a 800 width screen, a 32 width character would go through one screen in 400ms.
      // 800 / 32 / 60 = 0.416
      it.skip(`can go uphill from a 45° slope to a 0° jump through platform`, function () {
        // Put a platform.
        const slope = addUpSlopePlatformObject(runtimeScene);
        slope.setCustomWidthAndHeight(50, 50);
        slope.setPosition(0, 0);

        const jumpThroughPlatform = addJumpThroughPlatformObject(runtimeScene);
        slope.setCustomWidthAndHeight(50, 50);
        jumpThroughPlatform.setPosition(
          slope.getX() + slope.getWidth(),
          slope.getY()
        );

        object.setPosition(0, -5);
        // Ensure the object falls on the platform
        fallOnPlatform(12);

        // Walk from the 1st platform to the 2nd one.
        walkRight(6);
        expect(object.getX()).to.be.above(jumpThroughPlatform.getX());
        // Gone upward following the 2nd platform.
        expect(object.getY()).to.be(
          jumpThroughPlatform.getY() - object.getHeight()
        );
      });
    });
  });

  [0, 25].forEach((slopeMaxAngle) => {
    describe(`(walk on slopes, slopeMaxAngle: ${slopeMaxAngle}°)`, function () {
      let runtimeScene;
      let object;

      beforeEach(function () {
        runtimeScene = makeTestRuntimeScene();

        // Put a platformer object on a platform
        object = new gdjs.TestRuntimeObject(runtimeScene, {
          name: 'obj1',
          type: '',
          behaviors: [
            {
              type: 'PlatformBehavior::PlatformerObjectBehavior',
              name: 'auto1',
              gravity: 1500,
              maxFallingSpeed: 1500,
              acceleration: 500,
              deceleration: 1500,
              maxSpeed: 500,
              jumpSpeed: 900,
              canGrabPlatforms: true,
              ignoreDefaultControls: true,
              slopeMaxAngle: slopeMaxAngle,
              jumpSustainTime: 0.2,
            },
          ],
          effects: [],
        });
        object.setCustomWidthAndHeight(10, 20);
        runtimeScene.addObject(object);
      });

      const fallOnPlatform = (maxFrameCount) => {
        // Ensure the object falls on the platform
        for (let i = 0; i < maxFrameCount; ++i) {
          runtimeScene.renderAndStep(1000 / 60);
        }
        //Check the object is on the platform
        expect(object.getBehavior('auto1').isFalling()).to.be(false);
        expect(object.getBehavior('auto1').isMoving()).to.be(false);
      };

      const walkRightCanStop = (frameCount) => {
        const behavior = object.getBehavior('auto1');
        for (let i = 0; i < frameCount; ++i) {
          const lastX = object.getX();
          const lastSpeed = behavior.getCurrentSpeed();
          behavior.simulateRightKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(behavior.isOnFloor()).to.be(true);
          expect(object.getX()).to.not.be.below(lastX);
        }
      };

      const walkLeftCanStop = (frameCount) => {
        const behavior = object.getBehavior('auto1');
        for (let i = 0; i < frameCount; ++i) {
          const lastX = object.getX();
          const lastSpeed = behavior.getCurrentSpeed();
          behavior.simulateLeftKey();
          runtimeScene.renderAndStep(1000 / 60);
          expect(behavior.isOnFloor()).to.be(true);
          expect(object.getX()).to.not.be.above(lastX);
        }
      };

      (slopeMaxAngle === 0
        ? [
            { angle: 5.7, height: 5 },
            { angle: 26, height: 25 },
          ]
        : // slopeMaxAngle === 25
          [{ angle: 26, height: 25 }]
      ).forEach((slopesDimension) => {
        it(`can't go uphill on a too steep slope (${slopesDimension.angle}°)`, function () {
          // Put a platform.
          const slope = addUpSlopePlatformObject(runtimeScene);
          slope.setCustomWidthAndHeight(50, slopesDimension.height);
          slope.setPosition(0, 0);

          object.setPosition(0, -10);
          // Ensure the object falls on the platform
          fallOnPlatform(20);
          const fallX = object.getX();
          const fallY = object.getY();

          // Stay still when Right is pressed
          const behavior = object.getBehavior('auto1');
          for (let i = 0; i < 10; ++i) {
            const lastSpeed = behavior.getCurrentSpeed();
            behavior.simulateRightKey();
            runtimeScene.renderAndStep(1000 / 60);
            expect(behavior.isOnFloor()).to.be(true);
            expect(object.getX()).to.be.within(
              fallX - epsilon,
              fallX + epsilon
            );
            expect(object.getY()).to.be.within(
              fallY - epsilon,
              fallY + epsilon
            );
          }
        });

        it(`can go downhill on a too steep slope (${slopesDimension.angle}°)`, function () {
          // Put a platform.
          const slope = addDownSlopePlatformObject(runtimeScene);
          slope.setCustomWidthAndHeight(50, slopesDimension.height);
          slope.setPosition(0, 0);

          object.setPosition(0, -60);
          // Ensure the object falls on the platform
          fallOnPlatform(20);
          const fallX = object.getX();
          const fallY = object.getY();

          // Fall and land on the platform in loop when Right is pressed
          const behavior = object.getBehavior('auto1');
          for (let i = 0; i < 10; ++i) {
            const lastX = object.getX();
            const lastY = object.getY();
            const lastSpeed = behavior.getCurrentSpeed();
            behavior.simulateRightKey();
            runtimeScene.renderAndStep(1000 / 60);
            expect(
              behavior.isOnFloor() || behavior.isFallingWithoutJumping()
            ).to.be(true);
            expect(object.getX()).to.be.above(lastX);
            expect(object.getY()).to.be.above(lastY);
            // Check that the object doesn't stop
            expect(behavior.getCurrentSpeed()).to.be.above(lastSpeed);
          }
        });

        // The log of the character positions moving to the right
        // without any obstacle:
        // LOG: 'OnFloor 35.13888888888889 -20'
        // LOG: 'OnFloor 38.333333333333336 -20'
        // LOG: 'OnFloor 41.66666666666667 -20'
        // The character is 10 width, at 38.33 is left is 48.33
        [
          // remainingDeltaX === 1.333
          47,
          // remainingDeltaX === 0.833
          47.5,
          // remainingDeltaX === 0.333
          48,
          // remainingDeltaX is big
          49,
          // Platform tiles will result to pixel aligned junctions.
          // A rotated platform will probably result to not pixel aligned junctions.
          48.9,
        ].forEach((slopeJunctionX) => {
          it(`(slopeJunctionX: ${slopeJunctionX}) can't go uphill from a 0° slope to a too steep slope (${slopesDimension.angle}°) going right`, function () {
            // Put a platform.
            const platform = addPlatformObject(runtimeScene);
            platform.setCustomWidthAndHeight(slopeJunctionX, 50);
            platform.setPosition(0, 0);

            const slope = addUpSlopePlatformObject(runtimeScene);
            slope.setCustomWidthAndHeight(50, slopesDimension.height);
            slope.setPosition(
              platform.getX() + platform.getWidth(),
              platform.getY() - slope.getHeight()
            );

            object.setPosition(0, -32);
            // Ensure the object falls on the platform
            fallOnPlatform(10);

            // Walk toward the 2nd platform.
            walkRightCanStop(30);
            // Is stopped at the slope junction.
            expect(object.getX()).to.be.within(
              Math.floor(slope.getX()) - object.getWidth(),
              // When the junction is not pixel aligned, the character will be stopped
              // but is able to move forward until it reaches the obstacle.
              slope.getX() - object.getWidth()
            );
            expect(object.getY()).to.be(platform.getY() - object.getHeight());
          });
        });

        // The log of the character positions moving to the left
        // without any obstacle:
        // LOG: 'OnFloor 54.861111111111114 -20'
        // LOG: 'OnFloor 51.66666666666667 -20'
        // LOG: 'OnFloor 48.333333333333336 -20'
        // This is a mirror of the previous case: x -> 100 - x
        [
          // remainingDeltaX === -1.333
          53,
          // remainingDeltaX === -0.833
          52.5,
          // remainingDeltaX === -0.333
          52,
          // remainingDeltaX is big
          51,
          // Platform tiles will result to pixel aligned junctions.
          // A rotated platform will probably result to not pixel aligned junctions.
          51.1,
        ].forEach((slopeJunctionX) => {
          it(`(slopeJunctionX: ${slopeJunctionX}) can't go uphill from a 0° slope to a too steep slope (${slopesDimension.angle}°) going left`, function () {
            // Put a platform.
            const platform = addPlatformObject(runtimeScene);
            platform.setCustomWidthAndHeight(100 - slopeJunctionX, 50);
            platform.setPosition(slopeJunctionX, 0);

            const slope = addDownSlopePlatformObject(runtimeScene);
            slope.setCustomWidthAndHeight(50, slopesDimension.height);
            slope.setPosition(
              slopeJunctionX - slope.getWidth(),
              platform.getY() - slope.getHeight()
            );

            object.setPosition(90, -32);
            // Ensure the object falls on the platform
            fallOnPlatform(10);

            // Walk toward the 2nd platform.
            walkLeftCanStop(30);
            // Is stopped at the slope junction.
            expect(object.getX()).to.be.within(
              // When the junction is not pixel aligned, the character will be stopped
              // but is able to move forward until it reaches the obstacle.
              platform.getX(),
              Math.ceil(platform.getX())
            );
            expect(object.getY()).to.be(platform.getY() - object.getHeight());
          });
        });
      });
    });
  });

  describe(`(walk on flat floors with custom hitbox)`, function () {
    let runtimeScene;
    let object;

    beforeEach(function () {
      runtimeScene = makeTestRuntimeScene();

      // Put a platformer object on a platform
      object = new gdjs.TestSpriteRuntimeObject(runtimeScene, {
        name: 'obj1',
        type: '',
        behaviors: [
          {
            type: 'PlatformBehavior::PlatformerObjectBehavior',
            name: 'auto1',
            gravity: 1500,
            maxFallingSpeed: 1500,
            acceleration: 500,
            deceleration: 1500,
            maxSpeed: 500,
            jumpSpeed: 900,
            canGrabPlatforms: true,
            ignoreDefaultControls: true,
            slopeMaxAngle: 60,
            jumpSustainTime: 0.2,
          },
        ],
        effects: [],
        animations: [
          {
            name: 'animation',
            directions: [
              {
                sprites: [
                  {
                    originPoint: { x: 25, y: 25 },
                    centerPoint: { x: 50, y: 50 },
                    points: [
                      { name: 'Center', x: 0, y: 0 },
                      { name: 'Origin', x: 50, y: 50 },
                    ],
                    hasCustomCollisionMask: true,
                    customCollisionMask: [
                      [
                        { x: 25, y: 25 },
                        { x: 75, y: 25 },
                        { x: 75, y: 75 },
                        { x: 25, y: 75 },
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      object.setUnscaledWidthAndHeight(100, 100);
      object.setCustomWidthAndHeight(20, 40);
      runtimeScene.addObject(object);
    });

    // The actual hitbox is 10x20.
    const objectWidth = 10;
    const objectHeight = 20;

    const fall = (frameCount) => {
      for (let i = 0; i < frameCount; ++i) {
        const lastY = object.getY();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isFalling()).to.be(true);
        expect(object.getBehavior('auto1').isFallingWithoutJumping()).to.be(
          true
        );
        expect(object.getBehavior('auto1').isMoving()).to.be(true);
        expect(object.getY()).to.be.above(lastY);
      }
    };

    const walkRight = (frameCount) => {
      const behavior = object.getBehavior('auto1');
      for (let i = 0; i < frameCount; ++i) {
        const lastX = object.getX();
        const lastSpeed = behavior.getCurrentSpeed();
        behavior.simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(behavior.isOnFloor()).to.be(true);
        expect(object.getX()).to.be.above(lastX);
        // Check that the object doesn't stop
        expect(behavior.getCurrentSpeed()).to.be.above(lastSpeed);
      }
    };

    const fallOnPlatform = (maxFrameCount) => {
      // Ensure the object falls on the platform
      for (let i = 0; i < maxFrameCount; ++i) {
        runtimeScene.renderAndStep(1000 / 60);
      }
      //Check the object is on the platform
      expect(object.getBehavior('auto1').isFalling()).to.be(false);
      expect(object.getBehavior('auto1').isMoving()).to.be(false);
    };

    it('can walk on a platform and be blocked by a wall', function () {
      // Put a platform.
      const platform = addPlatformObject(runtimeScene);
      platform.setPosition(0, -10);
      // the 2nd platform is 2 pixels higher
      const wall = addPlatformObject(runtimeScene);
      wall.setPosition(
        platform.getX() + platform.getWidth(),
        // The platform is top is over the object
        // and platform is bottom is under the object.
        platform.getY() - wall.getHeight() + 5
      );

      object.setPosition(30, -32);
      // Ensure the object falls on the platform
      fallOnPlatform(10);
      expect(object.getY()).to.be(-30); // -30 = -10 (platform y) + -20 (object height)

      // walk right
      for (let i = 0; i < 25; ++i) {
        object.getBehavior('auto1').simulateRightKey();
        runtimeScene.renderAndStep(1000 / 60);
        expect(object.getBehavior('auto1').isOnFloor()).to.be(true);
      }
      // is blocked by the wall
      expect(object.getX()).to.be(wall.getX() - objectWidth);
      expect(object.getY()).to.be(platform.getY() - objectHeight);
    });
  });
});
