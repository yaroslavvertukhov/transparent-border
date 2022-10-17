/**
 * Дефолтные значения параметров:
 * радиус бордера - 16
 * цвет бордера - #333758
 * цвет заливки фона при ховере - #151022
 *
 * Дата HTML атрибуты для кастомизации. Они не обязательны:
 * data-border-color - цвет бордера
 * data-hover-color - цвет заливки фона при ховере
 * data-border-radius - радиус бордера
 *
 * Образец:
 * <canvas class="js-canvas-border" data-border-color="#333758" data-border-radius="16" data-hover-color="#151022"></canvas>
 */

class BlocksBorder {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.parent = canvas.parentNode;

        this.options = {
            radius: canvas.getAttribute('data-border-radius') ? parseInt(canvas.getAttribute('data-border-radius')) : 16,
            color: canvas.getAttribute('data-border-color') ? canvas.getAttribute('data-border-color') : '#333758',
            hoverColor: canvas.getAttribute('data-hover-color') ? canvas.getAttribute('data-hover-color') : '#151022'
        }

        this.isHover = false;

        this.init();
    }

    paintRoundRect(x1, y1, x2, y2, radius) {
        radius = Math.min(radius, (x2 - x1) / 2, (y2 - y1) / 2); // избегаем артефактов, в случае если радиус скругления больше одной из сторон
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + radius, y1);
        this.ctx.lineTo(x2 - radius, y1);
        this.ctx.arcTo(x2, y1, x2, y1 + radius, radius);
        this.ctx.lineTo(x2, y2 - radius);
        this.ctx.arcTo(x2, y2, x2 - radius, y2, radius);
        this.ctx.lineTo(x1 + radius, y2);
        this.ctx.arcTo(x1, y2, x1, y2 - radius, radius);
        this.ctx.lineTo(x1, y1 + radius);
        this.ctx.arcTo(x1, y1, x1 + radius, y1, radius);

        if (this.isHover) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    getGradientBorder() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);

        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, this.options.color);

        return  gradient;
    }

    getGradientBG() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);

        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, this.options.hoverColor);

        return  gradient;
    }

    tick() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.getGradientBG();
        this.ctx.strokeStyle = this.getGradientBorder();

        this.paintRoundRect(1, 1, this.canvas.width - 1, this.canvas.height - 1, this.options.radius);

        requestAnimationFrame(() => this.tick());
    }

    updateSizeCanvas() {
        this.canvas.width = Math.round(this.parent.getBoundingClientRect().width);
        this.canvas.height = Math.round(this.parent.getBoundingClientRect().height);
    }

    addHandlers() {
        window.addEventListener('resize', () => {
            this.updateSizeCanvas();
        });
        this.parent.addEventListener('mouseover', () => {
            this.isHover = true;
        })
        this.parent.addEventListener('mouseout', () => {
            this.isHover = false;
        })
    }

    init() {
        this.updateSizeCanvas();
        this.addHandlers();
        this.tick();
    }
}

const blocksBorders = document.querySelectorAll('.js-canvas-border');

blocksBorders.forEach((blocksBorder) => {
    new BlocksBorder(blocksBorder);
})
