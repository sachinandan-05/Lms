"use client";
import React from "react";
import { styles } from "@/app/styles/style";

type Props = {
  courseInfo: any;
  setCourseInfo: any;
  active: number;
  setActive: (active: number) => void;
  categories: any[];
};

const CourseInformation: React.FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
  categories,
}) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  };

  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name */}
        <div>
          <label className={styles.label}>Course Name</label>
          <input
            type="text"
            required
            value={courseInfo.name}
            onChange={(e) => setCourseInfo({ ...courseInfo, name: e.target.value })}
            className={`${styles.input}`}
            placeholder="Ex: Advanced MERN Stack Course"
          />
        </div>

        {/* Course Description */}
        <div>
          <label className={styles.label}>Course Description</label>
          <textarea
            required
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
            className={`${styles.input} min-h-[150px]`}
            placeholder="Enter course details..."
          />
        </div>

        {/* Price */}
        <div>
          <label className={styles.label}>Course Price</label>
          <input
            type="number"
            required
            value={courseInfo.price}
            onChange={(e) => setCourseInfo({ ...courseInfo, price: e.target.value })}
            className={`${styles.input}`}
            placeholder="Ex: 499"
          />
        </div>

        {/* Estimated Price */}
        <div>
          <label className={styles.label}>Estimated Price (Optional)</label>
          <input
            type="number"
            value={courseInfo.estimatedPrice}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
            }
            className={`${styles.input}`}
            placeholder="Ex: 999"
          />
        </div>

        {/* Category Select */}
        <div>
          <label className={styles.label}>Select Category</label>
          <select
            className={`${styles.input}`}
            value={courseInfo.categories}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, categories: e.target.value })
            }
          >
            <option value="">Select a category</option>
            {categories?.map((category, index) => (
              <option 
                className="dark:bg-[#000] text-[#fff]"
                key={index}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className={styles.label}>Course Level</label>
          <input
            type="text"
            required
            value={courseInfo.level}
            onChange={(e) => setCourseInfo({ ...courseInfo, level: e.target.value })}
            className={`${styles.input}`}
            placeholder="Ex: Beginner / Intermediate / Advanced"
          />
        </div>

        {/* Tags */}
        <div>
          <label className={styles.label}>Course Tags (comma separated)</label>
          <input
            type="text"
            value={courseInfo.tags}
            onChange={(e) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
            className={`${styles.input}`}
            placeholder="Ex: react, node, mongodb"
          />
        </div>

        {/* Demo URL */}
        <div>
          <label className={styles.label}>Demo URL (Optional)</label>
          <input
            type="text"
            value={courseInfo.demoUrl}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
            }
            className={`${styles.input}`}
            placeholder="Ex: https://youtube.com/..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
