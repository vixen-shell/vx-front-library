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
        }
    }
)
