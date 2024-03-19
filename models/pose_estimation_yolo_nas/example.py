from super_gradients.training import models
from super_gradients.common.object_names import Models

yolo_nas_pose = models.get(Models.YOLO_NAS_POSE_L, pretrained_weights="coco_pose")

prediction = yolo_nas_pose.predict("../assets/beatles.png")
prediction.show()
