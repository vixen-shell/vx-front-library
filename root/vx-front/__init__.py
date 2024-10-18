from vx_root import root_feature, ContextMenu, root_content

feature = root_feature()

feature.init(
    {
        "frames": {
            "main": {
                "name": "Vixen",
                "route": "main",
            }
        },
    }
)

content = root_content()


@content.dispatch("menu")
def menu_test():
    menu_test: ContextMenu = {
        "Menu item 1": {"entry": lambda: print("Click on menu item 1")},
        "Menu item 2": {"entry": lambda: print("Click on menu item 2")},
        "Sub Menu 1": {
            "entry": {
                "Sub menu item 1": {"entry": lambda: print("Click on sub menu item 1")},
                "Sub menu item 2": {"entry": lambda: print("Click on sub menu item 2")},
            }
        },
    }

    return menu_test
