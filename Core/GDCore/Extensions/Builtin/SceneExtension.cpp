/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "AllBuiltinExtensions.h"
#include "GDCore/Tools/Localization.h"

using namespace std;
namespace gd {

void GD_CORE_API BuiltinExtensionsImplementer::ImplementsSceneExtension(
    gd::PlatformExtension& extension) {
  extension
      .SetExtensionInformation(
          "BuiltinScene",
          _("Scene management features"),
          _("Actions and conditions to manipulate the scenes during the game."),
          "Florian Rival",
          "Open source (MIT License)")
      .SetExtensionHelpPath("" /*TODO: Add a documentation page for this */);


  extension
      .AddExpression("Random",
                     _("Random integer"),
                     _("Random integer"),
                     _("Random"),
                     "res/actions/position.png")
      .SetHelpPath("/all-features/expressions")
      .AddParameter("expression", _("Maximum value"));

  extension
      .AddExpression("RandomInRange",
                     _("Random integer in range"),
                     _("Random integer in range"),
                     _("Random"),
                     "res/actions/position.png")
      .SetHelpPath("/all-features/expressions")
      .AddParameter("expression", _("Minimum value"))
      .AddParameter("expression", _("Maximum value"));

  extension
      .AddExpression("RandomFloat",
                     _("Random float"),
                     _("Random float"),
                     _("Random"),
                     "res/actions/position.png")
      .SetHelpPath("/all-features/expressions")
      .AddParameter("expression", _("Maximum value"));

  extension
      .AddExpression("RandomFloatInRange",
                     _("Random float in range"),
                     _("Random float in range"),
                     _("Random"),
                     "res/actions/position.png")
      .SetHelpPath("/all-features/expressions")
      .AddParameter("expression", _("Minimum value"))
      .AddParameter("expression", _("Maximum value"));

  extension
      .AddExpression("RandomWithStep",
                     _("Random value in steps"),
                     _("Random value in steps"),
                     _("Random"),
                     "res/actions/position.png")
      .SetHelpPath("/all-features/expressions")
      .AddParameter("expression", _("Minimum value"))
      .AddParameter("expression", _("Maximum value"))
      .AddParameter("expression", _("Step"));

  extension
      .AddStrExpression("CurrentSceneName",
                        _("Current scene name"),
                        _("Name of the current scene"),
                        _("Scene"),
                        "res/actions/texte.png")
      .AddCodeOnlyParameter("currentScene", "");

  extension
      .AddCondition("DepartScene",
                    _("At the beginning of the scene"),
                    _("Is true only when scene just begins."),
                    _("At the beginning of the scene"),
                    _("Scene"),
                    "res/conditions/depart24.png",
                    "res/conditions/depart.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .MarkAsSimple();

  extension
      .AddCondition("SceneJustResumed",
                    _("Scene just resumed"),
                    _("The scene has just resumed after being paused."),
                    _("Scene just resumed"),
                    _("Scene"),
                    "res/conditions/depart24.png",
                    "res/conditions/depart.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .MarkAsSimple();

  extension
      .AddAction("Scene",
                 _("Change the scene"),
                 _("Stop this scene and start the specified one instead."),
                 _("Change to scene _PARAM1_"),
                 _("Scene"),
                 "res/actions/replaceScene24.png",
                 "res/actions/replaceScene.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("sceneName", _("Name of the new scene"))
      .AddParameter("yesorno", _("Stop any other paused scenes?"))
      .SetDefaultValue("true")
      .MarkAsAdvanced();

  extension
      .AddAction("PushScene",
                 _("Pause and start a new scene"),
                 _("Pause this scene and start the specified one.\nLater, you "
                   "can use the \"Stop and go back to previous scene\" action "
                   "to go back to this scene."),
                 _("Pause the scene and start _PARAM1_"),
                 _("Scene"),
                 "res/actions/pushScene24.png",
                 "res/actions/pushScene.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("sceneName", _("Name of the new scene"))
      .MarkAsAdvanced();

  extension
      .AddAction(
          "PopScene",
          _("Stop and go back to previous scene"),
          _("Stop this scene and go back to the previous paused one.\nTo pause "
            "a scene, use the \"Pause and start a new scene\" action."),
          _("Stop the scene and go back to the previous paused one"),
          _("Scene"),
          "res/actions/popScene24.png",
          "res/actions/popScene.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .MarkAsAdvanced();

  extension
      .AddAction("Quit",
                 _("Quit the game"),
                 _("Quit the game"),
                 _("Quit the game"),
                 _("Scene"),
                 "res/actions/quit24.png",
                 "res/actions/quit.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .MarkAsAdvanced();

  extension
      .AddAction("SceneBackground",
                 _("Change background color"),
                 _("Change the background color of the scene."),
                 _("Set background color to _PARAM1_"),
                 _("Scene"),
                 "res/actions/background24.png",
                 "res/actions/background.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("color", _("Color"))
      .MarkAsAdvanced();

  extension
      .AddAction("DisableInputWhenFocusIsLost",
                 _("Disable input when focus is lost"),
                 _("mouse buttons must be taken "
                   "into account even\nif the window is not active."),
                 _("Disable input when focus is lost: _PARAM1_"),
                 _("Scene"),
                 "res/actions/window24.png",
                 "res/actions/window.png")
      .SetHelpPath("/interface/scene-editor/events")
      .AddCodeOnlyParameter("currentScene", "")
      .AddParameter("yesorno", _("Deactivate input when focus is lost"))
      .MarkAsAdvanced();

  extension
      .AddCondition("Egal",
                    _("Compare two numbers"),
                    _("Compare the two numbers."),
                    _("_PARAM0_ _PARAM1_ _PARAM2_"),
                    _("Other"),
                    "res/conditions/egal24.png",
                    "res/conditions/egal.png")
      .SetHelpPath("/all-features/advanced-conditions")
      .AddParameter("expression", _("First expression"))
      .AddParameter("relationalOperator", _("Sign of the test"), "number")
      .AddParameter("expression", _("Second expression"))
      .MarkAsAdvanced();

  extension
      .AddCondition("StrEqual",
                    _("Compare two strings"),
                    _("Compare the two strings."),
                    _("_PARAM0_ _PARAM1_ _PARAM2_"),
                    _("Other"),
                    "res/conditions/egal24.png",
                    "res/conditions/egal.png")
      .SetHelpPath("/all-features/advanced-conditions")
      .AddParameter("string", _("First string expression"))
      .AddParameter("relationalOperator", _("Sign of the test"), "string")
      .AddParameter("string", _("Second string expression"))
      .MarkAsAdvanced();
}

}  // namespace gd
