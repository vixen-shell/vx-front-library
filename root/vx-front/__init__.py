from vx_feature_utils import Utils

utils = Utils.define_feature_utils()
content = Utils.define_feature_content(
    {
        "frames": {
            "main": {
                "name": "Vixen Panel",
                "route": "main",
                "layer_frame": {
                    "monitor_id": 0,
                    "height": 42,
                    "anchor_edge": "top",
                    "alignment": "center",
                    "auto_exclusive_zone": True,
                    "level": "top",
                },
            }
        },
        "state": "disable",
    }
)
