"use strict";

define(function() {
    return function cell(x, y) {
        var that, x_pos, y_pos, is_alive, age;
        that = {};
        age = 0;
        x_pos = x;
        y_pos = y;
        is_alive = true;

        that.age = function() {
            return age;
        }

        that.die = function() {
            is_alive = false;
        }

        that.isAlive = function() {
            return is_alive;
        }

        that.resurrect = function() {
            age = 0;
            is_alive = true;
        }

        that.tick = function() {
            age += 1;
        }

        that.x = function() {
            return x_pos;
        }

        that.y = function() {
            return y_pos;
        }

        return that;
    }
});
