from vx_feature_utils import Utils

utils = Utils.define_feature_utils()
content = Utils.define_feature_content(
    {
        "frames": {
            "main": {
                "name": "Main frame",
                "route": "main",
                "layer_frame": "disable",
            }
        },
        "state": "disable",
    }
)


@content.add_handler("data")
def hello(name: str = "World"):
    return f"Hello {name} !!!"


@content.add_handler("data")
def day():
    return "Monday"
