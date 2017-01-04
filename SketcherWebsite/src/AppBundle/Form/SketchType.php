<?php

namespace AppBundle\Form;

use AppBundle\Entity\Sketch;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class SketchType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class, array(
			'label' => 'sketch.title'
		))
        ->add('width', IntegerType::class, array(
			'label' => 'sketch.width',
			'data' => '1000'
		))
        ->add('height', IntegerType::class, array(
			'label' => 'sketch.height',
			'data' => '800'
		))
		->add('tags', CollectionType::class, array(
			'label' => 'sketch.tags',
			'entry_type' => TagType::class,
			'allow_add' => true,
			'allow_delete' => true,
			'prototype' => true
		));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Sketch::class,
        ));
    }
}
