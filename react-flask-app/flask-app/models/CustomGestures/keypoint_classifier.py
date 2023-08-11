# -*- coding: utf-8 -*-
import numpy as np
import tensorflow as tf


class KeyPointClassifier(object):
    def __init__(
        self,
        model_path=r"models/CustomGestures/keypoint_classifier.tflite",
        num_threads=1,
    ):
        self.interpreter = tf.lite.Interpreter(model_path=model_path, num_threads=num_threads)

        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

    def __call__(
        self,
        landmark_list,
    ):
        input_details_tensor_index = self.input_details[0]["index"]
        self.interpreter.set_tensor(input_details_tensor_index, np.array([landmark_list], dtype=np.float32))
        self.interpreter.invoke()

        output_details_tensor_index = self.output_details[0]["index"]

        # result is an array of confidence scores of each csv label
        result = self.interpreter.get_tensor(output_details_tensor_index)

        result_index = np.argmax(np.squeeze(result))
        result_score = np.squeeze(result)[result_index]

        return result_index, result_score
