drop database umc;
create database umc;
use umc;

DROP TABLE IF EXISTS `term`;

CREATE TABLE `term` (
                        `id`	BIGINT	NOT NULL,
                        `title`	VARCHAR(20)	NOT NULL,
                        `content`	TEXT	NOT NULL,
                        `is_required`	TINYINT	NOT NULL,
                        `user_type`	ENUM('USER', 'STORE')	NULL
);

DROP TABLE IF EXISTS `location`;

CREATE TABLE `location` (
                            `id`	BIGINT	NOT NULL,
                            `name`	char(10)	NOT NULL
);

DROP TABLE IF EXISTS `inquiry`;

CREATE TABLE `inquiry` (
                           `Id`	BIGINT	NOT NULL,
                           `user_id`	BIGINT	NOT NULL	COMMENT '누가 썼는지 역할',
                           `category_id`	BIGINT	NOT NULL,
                           `title`	CHAR(20)	NOT NULL,
                           `content`	VARCHAR(255)	NOT NULL,
                           `answer`	VARCHAR(255)	NULL,
                           `created_at`	DATETIME(6)	NOT NULL,
                           `answered_at`	DATETIME	NULL,
                           `deleted_at`	DATETIME	NULL
);

DROP TABLE IF EXISTS `store`;

CREATE TABLE `store` (
                         `id`	BIGINT	NOT NULL,
                         `user_id`	BIGINT	NOT NULL	COMMENT '비식별관계 - 사장님이 바뀔 수 있음',
                         `name`	VARCHAR(20)	NOT NULL,
                         `open_at`	TIME	NOT NULL,
                         `closed_at`	TIME	NOT NULL,
                         `created_at`	DATETIME	NOT NULL,
                         `deleted_at`	DATETIME	NULL
);

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
                        `id`	BIGINT	NOT NULL,
                        `nickname`	VARCHAR(10)	NOT NULL,
                        `gender`	ENUM('MALE', 'FEMALE', 'NONE')	NOT NULL,
                        `birth`	DATETIME	NULL,
                        `email`	VARCHAR(255)	NOT NULL,
                        `social_id`	VARCHAR(255)	NOT NULL,
                        `social_type`	ENUM('KAKAO', 'NAVER', 'APPLE', 'GOOGLE')	NULL,
                        `phone_number`	CHAR(11)	NULL,
                        `Is_phone_verified`	TINYINT	NULL,
                        `phone_verified_at`	DATETIME	NULL,
                        `address_doro`	VARCHAR(20)	NULL,
                        `address_detail`	VARCHAR(20)	NULL,
                        `profile_url`	VARCHAR(255)	NULL,
                        `role`	ENUM('ADMIN', 'USER', 'STORE')	NULL,
                        `inquiry_answer_on`	TINYINT	NOT NULL	DEFAULT false,
                        `review_on`	TINYINT	NOT NULL	DEFAULT false	COMMENT '유저라면 리뷰답변, 사장님이라면 리뷰알림',
                        `event_on`	TINYINT	NOT NULL	DEFAULT false,
                        `created_at`	DATETIME	NOT NULL,
                        `deleted_at`	DATETIME	NULL
);

DROP TABLE IF EXISTS `store_category`;

CREATE TABLE `store_category` (
                                  `category_id`	BIGINT	NOT NULL,
                                  `store_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `image`;

CREATE TABLE `image` (
                         `id`	BIGINT	NOT NULL,
                         `org_name`	VARCHAR(100)	NOT NULL,
                         `stored_name`	VARCHAR(100)	NOT NULL,
                         `url`	VARCHAR(255)	NOT NULL,
                         `order`	INT	NOT NULL,
                         `target_type`	ENUM('REVIEW', 'STORE', 'INQUIRY')	NOT NULL,
                         `target_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `notification`;

CREATE TABLE `notification` (
                                `id`	BIGINT	NOT NULL,
                                `note_type`	ENUM('INQUIRY', 'REVIEW', 'EVENT', 'MISSION')	NOT NULL,
                                `target_id`	BIGINT	NOT NULL,
                                `title`	CHAR(20)	NOT NULL,
                                `content`	VARCHAR(255)	NOT NULL,
                                `created_at`	DATETIME(6)	NOT NULL,
                                `receiver_id`	BIGINT	NOT NULL	COMMENT 'null이라면 모두에게 전송',
                                `sender_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `point`;

CREATE TABLE `point` (
                         `id`	BIGINT	NOT NULL,
                         `user_id`	BIGINT	NOT NULL,
                         `amount`	INT	NOT NULL,
                         `source_type`	ENUM('MISSION_COMPLETE', 'PURCHASE', 'EVENT', 'RETURN' )	NOT NULL,
                         `source_id`	BIGINT	NOT NULL,
                         `created_at`	DATETIME(6)	NOT NULL
);

DROP TABLE IF EXISTS `user_term`;

CREATE TABLE `user_term` (
                             `term_id`	BIGINT	NOT NULL,
                             `user_id`	BIGINT	NOT NULL,
                             `agree_at`	DATETIME	NOT NULL,
                             `cancel_at`	DATETIME	NULL
);

DROP TABLE IF EXISTS `food_category`;

CREATE TABLE `food_category` (
                                 `id`	BIGINT	NOT NULL,
                                 `name`	VARCHAR(5)	NULL
);

DROP TABLE IF EXISTS `mission`;

CREATE TABLE `mission` (
                           `id`	BIGINT	NOT NULL,
                           `price`	INT	NOT NULL,
                           `point`	INT	NOT NULL,
                           `end_at`	DATETIME	NOT NULL,
                           `created_at`	DATETIME	NOT NULL,
                           `updated_at`	DATETIME	NULL,
                           `deleted_at`	DATETIME	NULL	COMMENT '특정 과거시점 1999년을 넣어 null 피하기',
                           `store_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `user_favorite_food`;

CREATE TABLE `user_favorite_food` (
                                      `food_category_id`	BIGINT	NOT NULL,
                                      `user_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `review`;

CREATE TABLE `review` (
                          `user_mission_id`	BIGINT	NOT NULL,
                          `content`	VARCHAR(100)	NOT NULL,
                          `answer`	VARCHAR(100)	NULL,
                          `score`	INT	NULL,
                          `created_at`	DATETIME	NOT NULL,
                          `answered_at`	DATETIME	NULL,
                          `deleted_at`	DATETIME	NULL,
                          `user_id`	BIGINT	NOT NULL,
                          `store_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `user_mission`;

CREATE TABLE `user_mission` (
                                `id`	BIGINT	NOT NULL,
                                `created_at`	DATETIME	NOT NULL,
                                `status`	ENUM('PROGRESS', 'PENDING', 'SUCCESS')	NOT NULL	DEFAULT 'PROGRESS'	COMMENT 'pending:  신고 조치 등',
                                `updated_at`	DATETIME	NULL,
                                `deleted_at`	DATETIME	NULL,
                                `mission_id`	BIGINT	NOT NULL,
                                `user_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `user_location`;

CREATE TABLE `user_location` (
                                 `location_id`	BIGINT	NOT NULL,
                                 `user_id`	BIGINT	NOT NULL,
                                 `selected`	tinyint	NOT NULL	DEFAULT false
);

DROP TABLE IF EXISTS `notification_read`;

CREATE TABLE `notification_read` (
                                     `id`	BIGINT	NOT NULL,
                                     `read_at`	DATETIME(6)	NULL,
                                     `user_id`	BIGINT	NOT NULL,
                                     `notification_id`	BIGINT	NOT NULL
);

DROP TABLE IF EXISTS `inquiry_category`;

CREATE TABLE `inquiry_category` (
                                    `id`	BIGINT	NOT NULL,
                                    `name`	CHAR(10)	NOT NULL
);

ALTER TABLE `term` ADD CONSTRAINT `PK_TERM` PRIMARY KEY (
                                                         `id`
    );

ALTER TABLE `location` ADD CONSTRAINT `PK_LOCATION` PRIMARY KEY (
                                                                 `id`
    );

ALTER TABLE `inquiry` ADD CONSTRAINT `PK_INQUIRY` PRIMARY KEY (
                                                               `Id`
    );

ALTER TABLE `store` ADD CONSTRAINT `PK_STORE` PRIMARY KEY (
                                                           `id`
    );

ALTER TABLE `user` ADD CONSTRAINT `PK_USER` PRIMARY KEY (
                                                         `id`
    );

ALTER TABLE `store_category` ADD CONSTRAINT `PK_STORE_CATEGORY` PRIMARY KEY (
                                                                             `category_id`,
                                                                             `store_id`
    );

ALTER TABLE `image` ADD CONSTRAINT `PK_IMAGE` PRIMARY KEY (
                                                           `id`
    );

ALTER TABLE `notification` ADD CONSTRAINT `PK_NOTIFICATION` PRIMARY KEY (
                                                                         `id`
    );

ALTER TABLE `point` ADD CONSTRAINT `PK_POINT` PRIMARY KEY (
                                                           `id`,
                                                           `user_id`
    );

ALTER TABLE `user_term` ADD CONSTRAINT `PK_USER_TERM` PRIMARY KEY (
                                                                   `term_id`,
                                                                   `user_id`
    );

ALTER TABLE `food_category` ADD CONSTRAINT `PK_FOOD_CATEGORY` PRIMARY KEY (
                                                                           `id`
    );

ALTER TABLE `mission` ADD CONSTRAINT `PK_MISSION` PRIMARY KEY (
                                                               `id`
    );

ALTER TABLE `user_favorite_food` ADD CONSTRAINT `PK_USER_FAVORITE_FOOD` PRIMARY KEY (
                                                                                     `food_category_id`,
                                                                                     `user_id`
    );

ALTER TABLE `user_mission` ADD CONSTRAINT `PK_USER_MISSION` PRIMARY KEY (
                                                                         `id`
    );

ALTER TABLE `notification_read` ADD CONSTRAINT `PK_NOTIFICATION_READ` PRIMARY KEY (
                                                                                   `id`
    );

ALTER TABLE `inquiry_category` ADD CONSTRAINT `PK_INQUIRY_CATEGORY` PRIMARY KEY (
                                                                                 `id`
    );

ALTER TABLE `inquiry` ADD CONSTRAINT `FK_user_TO_inquiry_1` FOREIGN KEY (
                                                                         `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `inquiry` ADD CONSTRAINT `FK_inquiry_category_TO_inquiry_1` FOREIGN KEY (
                                                                                     `category_id`
    )
    REFERENCES `inquiry_category` (
                                   `id`
        );

ALTER TABLE `store` ADD CONSTRAINT `FK_user_TO_store_1` FOREIGN KEY (
                                                                     `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `store_category` ADD CONSTRAINT `FK_food_category_TO_store_category_1` FOREIGN KEY (
                                                                                                `category_id`
    )
    REFERENCES `food_category` (
                                `id`
        );

ALTER TABLE `store_category` ADD CONSTRAINT `FK_store_TO_store_category_1` FOREIGN KEY (
                                                                                        `store_id`
    )
    REFERENCES `store` (
                        `id`
        );

ALTER TABLE `notification` ADD CONSTRAINT `FK_user_TO_notification_1` FOREIGN KEY (
                                                                                   `receiver_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `notification` ADD CONSTRAINT `FK_user_TO_notification_2` FOREIGN KEY (
                                                                                   `sender_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `point` ADD CONSTRAINT `FK_user_TO_point_1` FOREIGN KEY (
                                                                     `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `user_term` ADD CONSTRAINT `FK_term_TO_user_term_1` FOREIGN KEY (
                                                                             `term_id`
    )
    REFERENCES `term` (
                       `id`
        );

ALTER TABLE `user_term` ADD CONSTRAINT `FK_user_TO_user_term_1` FOREIGN KEY (
                                                                             `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `mission` ADD CONSTRAINT `FK_store_TO_mission_1` FOREIGN KEY (
                                                                          `store_id`
    )
    REFERENCES `store` (
                        `id`
        );

ALTER TABLE `user_favorite_food` ADD CONSTRAINT `FK_food_category_TO_user_favorite_food_1` FOREIGN KEY (
                                                                                                        `food_category_id`
    )
    REFERENCES `food_category` (
                                `id`
        );

ALTER TABLE `user_favorite_food` ADD CONSTRAINT `FK_user_TO_user_favorite_food_1` FOREIGN KEY (
                                                                                               `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `review` ADD CONSTRAINT `FK_user_mission_TO_review_1` FOREIGN KEY (
                                                                               `user_mission_id`
    )
    REFERENCES `user_mission` (
                               `id`
        );

ALTER TABLE `review` ADD CONSTRAINT `FK_user_TO_review_1` FOREIGN KEY (
                                                                       `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `review` ADD CONSTRAINT `FK_store_TO_review_1` FOREIGN KEY (
                                                                        `store_id`
    )
    REFERENCES `store` (
                        `id`
        );

ALTER TABLE `user_mission` ADD CONSTRAINT `FK_mission_TO_user_mission_1` FOREIGN KEY (
                                                                                      `mission_id`
    )
    REFERENCES `mission` (
                          `id`
        );

ALTER TABLE `user_mission` ADD CONSTRAINT `FK_user_TO_user_mission_1` FOREIGN KEY (
                                                                                   `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `user_location` ADD CONSTRAINT `FK_location_TO_user_location_1` FOREIGN KEY (
                                                                                         `location_id`
    )
    REFERENCES `location` (
                           `id`
        );

ALTER TABLE `user_location` ADD CONSTRAINT `FK_user_TO_user_location_1` FOREIGN KEY (
                                                                                     `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `notification_read` ADD CONSTRAINT `FK_user_TO_notification_read_1` FOREIGN KEY (
                                                                                             `user_id`
    )
    REFERENCES `user` (
                       `id`
        );

ALTER TABLE `notification_read` ADD CONSTRAINT `FK_notification_TO_notification_read_1` FOREIGN KEY (
                                                                                                     `notification_id`
    )
    REFERENCES `notification` (
                               `id`
        );


