import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  id: number;
  title: string;
  image: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  slides: HeroSlide[] = [
    {
      id: 1,
      title: '',
      image: 'assets/products/Grapes1.jpg',
      color: '#7ccf8e'
    },
    {
      id: 2,
      title: '',
      image: 'assets/products/Onion1.jpg',
      color: '#6ba97f'
    },
    {
      id: 3,
      title: '',
      image: 'assets/products/Rice1.jpeg',
      color: '#5a8570'
    },
    {
      id: 4,
      title: '',
      image: 'assets/products/maize1.jpeg',
      color: '#546473'
    }
  ];

  currentSlideIndex = 0;
  private slideInterval: any;
  private slideIntervalTime = 5000; // 5 seconds per slide

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideIntervalTime);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  previousSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  getCurrentSlide(): HeroSlide {
    return this.slides[this.currentSlideIndex];
  }
}
